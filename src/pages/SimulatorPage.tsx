import React, { useState, useEffect } from 'react';
import {
  parseEquation,
  balanceEquation,
  classifyReaction,
  findSubstanceInCatalog,
  PRESET_REACTIONS,
  PresetReaction,
  ParsedEquation,
  BalanceResult,
  ReactionClassificationResult,
  predictReactionProducts
} from '../chemistry';
import { AtomCounterTable } from '../components/AtomCounterTable';
import { ReactionBadges } from '../components/ReactionBadges';
import { SubstanceDetailCard } from '../components/SubstanceDetailCard';
import { FormulaDisplay } from '../components/FormulaDisplay';
import { VisualEquationBuilder, ParticipantItem } from '../components/VisualEquationBuilder';
import { MolecularViewer } from '../components/MolecularViewer';
import { StoichiometryCalculator } from '../components/StoichiometryCalculator';
import { RedoxPanel } from '../components/RedoxPanel';
import { PeriodicTableModal } from '../components/PeriodicTableModal';
import {
  saveToHistory,
  getLocalHistory,
  clearLocalHistory,
  HistoryItem
} from '../services/historyService';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
  getLocalFavorites,
  FavoriteItem
} from '../services/favoritesService';
import {
  Trash2,
  CheckCircle,
  Sliders,
  ChevronRight,
  Star,
  History,
  PenTool,
  RotateCcw,
  X,
  Compass,
  Copy,
  Check,
  Scale,
} from 'lucide-react';
import './SimulatorPage.css';

type SimulatorTab = 'details' | 'molecules' | 'stoichiometry' | 'redox';

function parseVisualReactants(input: string): ParticipantItem[] {
  const reactantSide = input.split(/<=>|<->|⇌|-->|->|==>|=>|→|=/)[0]?.trim();
  if (!reactantSide) return [];

  const parsed = parseEquation(`${reactantSide} -> H2O`);
  if (!parsed.isValid) return [];

  return parsed.reactants.map(reactant => ({
    formula: reactant.formula,
    coefficient: reactant.coefficient
  }));
}

export const SimulatorPage: React.FC = () => {
  const [equationInput, setEquationInput] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const eqParam = params.get('eq');
    return eqParam || 'H2 + O2 -> H2O';
  });

  const [parsedEq, setParsedEq] = useState<ParsedEquation | null>(null);
  const [balanceResult, setBalanceResult] = useState<BalanceResult | null>(null);
  const [classification, setClassification] = useState<ReactionClassificationResult | null>(null);
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [manualCoeffs, setManualCoeffs] = useState<{ reactants: number[]; products: number[] }>({
    reactants: [1, 1],
    products: [1]
  });
  const [manualFeedback, setManualFeedback] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('synthesis-water');

  // Abas de navegação didática
  const [activeTab, setActiveTab] = useState<SimulatorTab>('details');

  // Modais e gavetas
  const [showVisualBuilder, setShowVisualBuilder] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showPeriodicModal, setShowPeriodicModal] = useState<boolean>(false);
  const [historyTab, setHistoryTab] = useState<'history' | 'favorites'>('history');
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [favoritesList, setFavoritesList] = useState<FavoriteItem[]>([]);
  const [isCurrentFav, setIsCurrentFav] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Trata parâmetro de inserção rápida da tabela periódica (?add=Fe)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addElem = params.get('add');
    if (addElem) {
      setEquationInput(prev => `${prev.trim()} + ${addElem}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Processa a equação sempre que o input mudar
  useEffect(() => {
    handleProcessEquation(equationInput);
    setIsCurrentFav(isFavorite(equationInput));

    // Atualiza o parâmetro na URL para compartilhamento
    if (equationInput.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('eq', equationInput);
      window.history.replaceState({}, '', url.toString());
    }
  }, [equationInput]);

  // Carrega histórico e favoritos
  const refreshStorageData = () => {
    setHistoryList(getLocalHistory());
    setFavoritesList(getLocalFavorites());
  };

  useEffect(() => {
    refreshStorageData();
  }, []);

  const handleProcessEquation = (input: string) => {
    const parsed = parseEquation(input);
    setParsedEq(parsed);
    setManualFeedback(null);

    if (parsed.isValid) {
      setManualCoeffs({
        reactants: parsed.reactants.map(r => r.coefficient || 1),
        products: parsed.products.map(p => p.coefficient || 1)
      });

      const classif = classifyReaction(parsed);
      setClassification(classif);

      const balanced = balanceEquation(parsed);
      setBalanceResult(balanced);

      if (balanced.success && balanced.balancedEquation) {
        saveToHistory(input, balanced.balancedEquation, !!balanced.isConserved);
      }
    } else {
      setClassification(null);
      setBalanceResult(null);
    }
  };

  const handleApplyPreset = (preset: PresetReaction) => {
    setSelectedPreset(preset.id);
    setEquationInput(preset.unbalanced);
    setManualMode(false);
  };

  const handleAutoBalance = () => {
    if (!parsedEq || !parsedEq.isValid) return;
    const balanced = balanceEquation(parsedEq);
    setBalanceResult(balanced);
    if (balanced.success && balanced.balancedEquation) {
      setEquationInput(balanced.balancedEquation);
      setManualMode(false);
      saveToHistory(equationInput, balanced.balancedEquation, true);
      refreshStorageData();
    }
  };

  const handleToggleFavorite = async () => {
    if (!equationInput.trim()) return;
    if (isCurrentFav) {
      await removeFavorite(equationInput);
      setIsCurrentFav(false);
    } else {
      await addFavorite(equationInput);
      setIsCurrentFav(true);
    }
    refreshStorageData();
  };

  const handleManualCoeffChange = (side: 'reactants' | 'products', index: number, delta: number) => {
    setManualCoeffs(prev => {
      const nextSide = [...prev[side]];
      const newVal = Math.max(1, (nextSide[index] || 1) + delta);
      nextSide[index] = newVal;
      return {
        ...prev,
        [side]: nextSide
      };
    });
  };

  const handleCheckManualBalance = () => {
    if (!parsedEq || !parsedEq.isValid || !balanceResult) return;

    const rTarget = balanceResult.reactantsCoefficients || [];
    const pTarget = balanceResult.productsCoefficients || [];

    const isMatch =
      rTarget.every((val, i) => val === manualCoeffs.reactants[i]) &&
      pTarget.every((val, i) => val === manualCoeffs.products[i]);

    if (isMatch) {
      setManualFeedback('Parabéns! Você balanceou a equação corretamente segundo a Lei de Lavoisier!');
    } else {
      setManualFeedback('Ainda não está balanceada. Observe a contagem de átomos abaixo para ajustar as proporções.');
    }
  };

  const insertSymbol = (symbol: string) => {
    setEquationInput(prev => `${prev.trim()} ${symbol} `);
  };

  const handleCopyEquation = (format: 'plain' | 'latex') => {
    const eq = balanceResult?.balancedEquation || equationInput;
    let textToCopy = eq;
    if (format === 'latex') {
      textToCopy = eq.replace(/->/g, '\\rightarrow ').replace(/⇌/g, '\\rightleftharpoons ');
    }
    navigator.clipboard.writeText(textToCopy);
    setCopyFeedback(format === 'latex' ? 'LaTeX copiado!' : 'Equação copiada!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Sincronização com o Montador Visual
  const handleVisualBuilderChange = (newReactants: ParticipantItem[], newProducts: ParticipantItem[]) => {
    const rStr = newReactants
      .map(r => (r.coefficient > 1 ? `${r.coefficient} ` : '') + r.formula)
      .join(' + ');
    const pStr = newProducts
      .map(p => (p.coefficient > 1 ? `${p.coefficient} ` : '') + p.formula)
      .join(' + ');

    if (!rStr && !pStr) {
      setEquationInput('');
    } else if (!pStr) {
      setEquationInput(`${rStr} -> `);
    } else {
      setEquationInput(`${rStr} -> ${pStr}`);
    }
  };

  const currentVisualReactants: ParticipantItem[] = parsedEq?.isValid
    ? parsedEq.reactants.map(r => ({ formula: r.formula, coefficient: r.coefficient }))
    : parseVisualReactants(equationInput);

  const currentVisualProducts: ParticipantItem[] = parsedEq?.isValid
    ? parsedEq.products.map(p => ({ formula: p.formula, coefficient: p.coefficient }))
    : [];

  const molecularReactants = parsedEq?.reactants.map((participant, index) => ({
    ...participant,
    coefficient: manualMode
      ? manualCoeffs.reactants[index] ?? participant.coefficient
      : balanceResult?.success
        ? balanceResult.reactantsCoefficients?.[index] ?? participant.coefficient
        : participant.coefficient
  })) ?? [];

  const molecularProducts = parsedEq?.products.map((participant, index) => ({
    ...participant,
    coefficient: manualMode
      ? manualCoeffs.products[index] ?? participant.coefficient
      : balanceResult?.success
        ? balanceResult.productsCoefficients?.[index] ?? participant.coefficient
        : participant.coefficient
  })) ?? [];

  const manualBalanceCorrect = Boolean(
    balanceResult?.success
    && balanceResult.reactantsCoefficients?.length === manualCoeffs.reactants.length
    && balanceResult.productsCoefficients?.length === manualCoeffs.products.length
    && balanceResult.reactantsCoefficients.every((coefficient, index) => coefficient === manualCoeffs.reactants[index])
    && balanceResult.productsCoefficients.every((coefficient, index) => coefficient === manualCoeffs.products[index])
  );
  const molecularBalance = manualMode
    ? manualBalanceCorrect
    : Boolean(balanceResult?.success && balanceResult.isConserved);
  const displayedEquation = parsedEq
    ? { ...parsedEq, reactants: molecularReactants, products: molecularProducts }
    : null;

  const productPrediction = predictReactionProducts(equationInput);
  const handleApplyProductPrediction = () => {
    if (!productPrediction) return;

    const completedReaction = balanceEquation(productPrediction.equation);
    setEquationInput(
      completedReaction.success && completedReaction.balancedEquation
        ? completedReaction.balancedEquation
        : productPrediction.equation
    );
    setManualMode(false);
  };

  return (
    <div className="simulator-page container">
      <header className="folio-header">
        <div>
          <h1 className="simulator-title">Balancear equações</h1>
        </div>
        <p className="simulator-subtitle">
          Toda reação tem uma proporção. Explore os reagentes, encontre o equilíbrio e veja o que se conserva.
        </p>
      </header>

      <div className="lab-workspace">
        <section className="editor-card" aria-label="Editor de reação">
          <div className="preset-picker">
            <label htmlFor="reaction-example">Comece por um exemplo</label>
            <select
              id="reaction-example"
              value={selectedPreset}
              onChange={event => {
                const preset = PRESET_REACTIONS.find(item => item.id === event.target.value);
                if (preset) handleApplyPreset(preset);
              }}
            >
              {PRESET_REACTIONS.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          </div>

          {/* Editor Principal da Equação */}
          <div className="editor-top-bar">
            <label htmlFor="equation-input" className="editor-label">
              Sua equação
            </label>
            <div className="quick-symbols">
              <span className="symbols-label">Inserir:</span>
              {['+', '->', '⇌', '(s)', '(l)', '(g)', '(aq)'].map(sym => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => insertSymbol(sym)}
                  className="symbol-btn"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="input-wrapper">
            <input
              id="equation-input"
              type="text"
              value={equationInput}
              onChange={e => setEquationInput(e.target.value)}
              placeholder="Digite só os reagentes: HCl + NaOH"
              className="equation-text-input"
              autoComplete="off"
              spellCheck="false"
              aria-describedby="equation-help"
            />
          </div>
          <p id="equation-help" className="equation-help">
            Use + entre os reagentes. Quando houver uma previsão segura, o QuimLab sugere e balanceia os produtos.
          </p>

          {productPrediction && (
            <aside className="product-prediction" aria-live="polite">
              <div className="prediction-copy">
                <span className="prediction-eyebrow">Produtos previstos · {productPrediction.reactionType}</span>
                <div className="prediction-formulas" aria-label={`Produtos previstos: ${productPrediction.products.join(' mais ')}`}>
                  {productPrediction.products.map((product, index) => (
                    <React.Fragment key={product}>
                      {index > 0 && <span className="prediction-plus">+</span>}
                      <FormulaDisplay formula={product} showTooltip={false} />
                    </React.Fragment>
                  ))}
                </div>
                <p>{productPrediction.explanation}</p>
              </div>
              <button
                type="button"
                onClick={handleApplyProductPrediction}
                className="btn prediction-apply-btn"
              >
                <ChevronRight size={18} />
                <span>Usar produtos e balancear</span>
              </button>
            </aside>
          )}

          {/* Mensagem de Erro no Parsing */}
          {parsedEq && !parsedEq.isValid && !productPrediction && (
            <div className="parse-error-box">
              <p className="error-message">{parsedEq.error}</p>
            </div>
          )}

          {/* Barra de Ações do Simulador */}
          <div className="editor-actions-bar">
            <button
              onClick={handleAutoBalance}
              className="btn btn-primary"
              disabled={!parsedEq?.isValid}
              title="Balancear equação automaticamente pelo método algébrico de frações exatas"
            >
              <Scale size={18} />
              <span>Balancear equação</span>
            </button>

            <button
              onClick={() => setShowVisualBuilder(!showVisualBuilder)}
              className={`btn ${showVisualBuilder ? 'btn-primary' : 'btn-secondary'}`}
              title="Abrir o montador visual com catálogo de substâncias"
            >
              <PenTool size={18} />
              <span>{showVisualBuilder ? 'Ocultar Montador' : 'Montador Visual'}</span>
            </button>

            <button
              onClick={() => setShowPeriodicModal(true)}
              className="btn btn-secondary"
              title="Abrir tabela periódica rápida"
            >
              <Compass size={18} />
              <span>Tabela Periódica</span>
            </button>

            <button
              onClick={() => setManualMode(!manualMode)}
              className={`btn ${manualMode ? 'btn-primary' : 'btn-secondary'}`}
              disabled={!parsedEq?.isValid}
              title="Ajustar coeficientes estequiométricos manualmente com botões de incremento"
            >
              <Sliders size={18} />
              <span>{manualMode ? 'Sair do Manual' : 'Desafio Manual'}</span>
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`btn btn-secondary ${isCurrentFav ? 'btn-fav-active' : ''}`}
              title={isCurrentFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Star size={18} className={isCurrentFav ? 'star-filled' : ''} />
              <span>{isCurrentFav ? 'Favoritado' : 'Favoritar'}</span>
            </button>

            <button
              onClick={() => {
                refreshStorageData();
                setShowHistoryModal(true);
              }}
              className="btn btn-secondary"
              title="Ver histórico recente e equações favoritas"
            >
              <History size={18} />
              <span>Histórico</span>
            </button>

            <div className="copy-action-group">
              <button
                onClick={() => handleCopyEquation('plain')}
                className="btn btn-secondary"
                title="Copiar equação balanceada para a área de transferência"
              >
                {copyFeedback ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
                <span>{copyFeedback || 'Copiar'}</span>
              </button>
              <button
                onClick={() => handleCopyEquation('latex')}
                className="btn btn-secondary btn-icon-only"
                title="Copiar em formato LaTeX para relatórios"
              >
                <span className="latex-badge">TeX</span>
              </button>
            </div>

            <button
              onClick={() => setEquationInput('')}
              className="btn btn-secondary"
              title="Limpar equação atual"
            >
              <Trash2 size={18} />
              <span>Limpar</span>
            </button>
          </div>
        </section>

        {showVisualBuilder && (
          <div className="workspace-expanded">
            <VisualEquationBuilder
              reactants={currentVisualReactants}
              products={currentVisualProducts}
              onChange={handleVisualBuilderChange}
              onClose={() => setShowVisualBuilder(false)}
            />
          </div>
        )}

        {/* Modo Desafio Manual com Controles de Coeficientes */}
        {manualMode && parsedEq?.isValid && (
          <section className="manual-mode-card card">
            <div className="manual-header">
              <h3>Ajuste os coeficientes</h3>
              <p>Utilize os botões + e - para encontrar a menor proporção inteira que balanceia a equação.</p>
            </div>

            <div className="manual-equation-builder">
              {/* Reagentes */}
              <div className="side-builders">
                <span className="side-label">Reagentes:</span>
                <div className="participants-builder-list">
                  {parsedEq.reactants.map((r, idx) => (
                    <div key={idx} className="participant-stepper-box">
                      <div className="stepper-controls">
                        <button
                          onClick={() => handleManualCoeffChange('reactants', idx, -1)}
                          className="stepper-btn"
                        >
                          -
                        </button>
                        <span className="stepper-value">{manualCoeffs.reactants[idx] || 1}</span>
                        <button
                          onClick={() => handleManualCoeffChange('reactants', idx, 1)}
                          className="stepper-btn"
                        >
                          +
                        </button>
                      </div>
                      <span className="stepper-formula">{r.formula}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="arrow-divider">
                <ChevronRight size={24} />
              </div>

              {/* Produtos */}
              <div className="side-builders">
                <span className="side-label">Produtos:</span>
                <div className="participants-builder-list">
                  {parsedEq.products.map((p, idx) => (
                    <div key={idx} className="participant-stepper-box">
                      <div className="stepper-controls">
                        <button
                          onClick={() => handleManualCoeffChange('products', idx, -1)}
                          className="stepper-btn"
                        >
                          -
                        </button>
                        <span className="stepper-value">{manualCoeffs.products[idx] || 1}</span>
                        <button
                          onClick={() => handleManualCoeffChange('products', idx, 1)}
                          className="stepper-btn"
                        >
                          +
                        </button>
                      </div>
                      <span className="stepper-formula">{p.formula}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="manual-actions">
              <button onClick={handleCheckManualBalance} className="btn btn-primary">
                <CheckCircle size={18} />
                <span>Verificar Meu Balanceamento</span>
              </button>
            </div>

            {manualFeedback && (
              <div className={`manual-feedback-banner ${manualFeedback.includes('Parabéns') ? 'success' : 'hint'}`}>
                {manualFeedback}
              </div>
            )}
          </section>
        )}

        {/* Visualização da Reação em Andamento */}
        {parsedEq && parsedEq.isValid && (
          <section className="reaction-display-card card">
            <div className="reaction-display-header">
              <h2 className="section-title">O equilíbrio da reação</h2>
              {molecularBalance && (
                <span className="badge badge-success"><CheckCircle size={15} aria-hidden="true" /> Equilibrada</span>
              )}
            </div>

            <div
              className="equation-visual-row"
              key={manualMode
                ? `manual:${manualCoeffs.reactants.join(',')}:${manualCoeffs.products.join(',')}`
                : balanceResult?.balancedEquation}
            >
              <div className="equation-side">
                {(displayedEquation?.reactants ?? parsedEq.reactants).map((r, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="plus-symbol">+</span>}
                    <FormulaDisplay
                      formula={r.formula}
                      coefficient={r.coefficient}
                      showTooltip={true}
                    />
                  </React.Fragment>
                ))}
              </div>

              <div className="equation-arrow-container">
                <span className="reaction-arrow">{parsedEq.isReversible ? '⇌' : '→'}</span>
              </div>

              <div className="equation-side">
                {(displayedEquation?.products ?? parsedEq.products).map((p, j) => (
                  <React.Fragment key={j}>
                    {j > 0 && <span className="plus-symbol">+</span>}
                    <FormulaDisplay
                      formula={p.formula}
                      coefficient={p.coefficient}
                      showTooltip={true}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Classificação da Reação */}
            {classification && (
              <details className="classification-block">
                <summary>Entender esta reação</summary>
                <ReactionBadges
                  classifications={classification.classifications}
                  characteristics={classification.characteristics}
                />
              </details>
            )}
            <p className="reaction-note">Os átomos se reorganizam.<br />A matéria se conserva.</p>
          </section>
        )}
        {(!parsedEq || !parsedEq.isValid) && (
          <section className="reaction-display-card reaction-empty" aria-label="Resultado da reação">
            <h2>Qual será a próxima reação?</h2>
            <p>Escolha um exemplo ou digite uma equação. O resultado aparece aqui.</p>
          </section>
        )}
      </div>

      {/* ==================================================================== */}
      {/* ABAS MULTIDIMENSIONAIS DE APRENDIZADO QUÍMICO */}
      {/* ==================================================================== */}
      {parsedEq && parsedEq.isValid && (
        <section className="didactic-tabs-container">
          <div className="tabs-navigation-bar">
            <button
              onClick={() => setActiveTab('details')}
              className={`tab-nav-btn ${activeTab === 'details' ? 'active' : ''}`}
              aria-pressed={activeTab === 'details'}
            >
              Conservação
            </button>

            <button
              onClick={() => setActiveTab('molecules')}
              className={`tab-nav-btn ${activeTab === 'molecules' ? 'active' : ''}`}
              aria-pressed={activeTab === 'molecules'}
            >
              Moléculas
            </button>

            <button
              onClick={() => setActiveTab('stoichiometry')}
              className={`tab-nav-btn ${activeTab === 'stoichiometry' ? 'active' : ''}`}
              aria-pressed={activeTab === 'stoichiometry'}
            >
              Estequiometria
            </button>

            <button
              onClick={() => setActiveTab('redox')}
              className={`tab-nav-btn ${activeTab === 'redox' ? 'active' : ''}`}
              aria-pressed={activeTab === 'redox'}
            >
              Redox
            </button>
          </div>

          <div className="tab-content-area">
            {/* ABA 1: CONSERVAÇÃO E SUBSTÂNCIAS */}
            {activeTab === 'details' && (
              <div className="tab-panel">
                {balanceResult?.atomTable && (
                  <AtomCounterTable
                    table={balanceResult.atomTable}
                    isBalanced={molecularBalance}
                    reactants={displayedEquation?.reactants ?? parsedEq.reactants}
                    products={displayedEquation?.products ?? parsedEq.products}
                  />
                )}

                {classification && balanceResult && (
                  <section className="explanation-section card">
                    <div className="explanation-header">
                      <h3>O que acontece nesta reação</h3>
                    </div>
                    <p className="explanation-text">
                      {classification.explanation.split(/(\*\*.*?\*\*)/g).map((part, index) =>
                        part.startsWith('**')
                          ? <strong key={index}>{part.slice(2, -2)}</strong>
                          : part
                      )}
                    </p>
                    {balanceResult.explanation && (
                      <p className="explanation-subtext">{balanceResult.explanation}</p>
                    )}
                  </section>
                )}

                <section className="participants-catalog-section">
                  <h3 className="section-heading">Substâncias da reação</h3>
                  <div className="substances-grid">
                    {displayedEquation?.reactants.map((r, idx) => (
                      <SubstanceDetailCard
                        key={`reactant-${idx}`}
                        formula={r.formula}
                        parsed={r.parsed}
                        catalogData={findSubstanceInCatalog(r.parsed.cleanFormula)}
                        role="Reagente"
                        coefficient={r.coefficient}
                      />
                    ))}
                    {displayedEquation?.products.map((p, idx) => (
                      <SubstanceDetailCard
                        key={`product-${idx}`}
                        formula={p.formula}
                        parsed={p.parsed}
                        catalogData={findSubstanceInCatalog(p.parsed.cleanFormula)}
                        role="Produto"
                        coefficient={p.coefficient}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ABA 2: MODELO MOLECULAR (ESFERAS CPK) */}
            {activeTab === 'molecules' && (
              <div className="tab-panel">
                <MolecularViewer
                  reactants={displayedEquation?.reactants ?? parsedEq.reactants}
                  products={displayedEquation?.products ?? parsedEq.products}
                  isBalanced={molecularBalance}
                />
              </div>
            )}

            {/* ABA 3: CALCULADORA ESTEQUIOMÉTRICA */}
            {activeTab === 'stoichiometry' && (
              <div className="tab-panel">
                <StoichiometryCalculator
                  equation={displayedEquation ?? parsedEq}
                  isBalanced={molecularBalance}
                />
              </div>
            )}

            {/* ABA 4: NOX & REDOX */}
            {activeTab === 'redox' && (
              <div className="tab-panel">
                <RedoxPanel equation={displayedEquation ?? parsedEq} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal / Tabela Periódica Rápida */}
      <PeriodicTableModal
        isOpen={showPeriodicModal}
        onClose={() => setShowPeriodicModal(false)}
        onSelectElement={sym => insertSymbol(sym)}
      />

      {/* Modal / Gaveta de Histórico e Favoritos */}
      {showHistoryModal && (
        <div className="modal-backdrop" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-container card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-tabs">
                <button
                  onClick={() => setHistoryTab('history')}
                  className={`modal-tab-btn ${historyTab === 'history' ? 'active' : ''}`}
                >
                  <History size={16} />
                  <span>Histórico Recente ({historyList.length})</span>
                </button>
                <button
                  onClick={() => setHistoryTab('favorites')}
                  className={`modal-tab-btn ${historyTab === 'favorites' ? 'active' : ''}`}
                >
                  <Star size={16} />
                  <span>Favoritos ({favoritesList.length})</span>
                </button>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="close-btn"
                title="Fechar histórico"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {historyTab === 'history' ? (
                historyList.length === 0 ? (
                  <div className="empty-modal-state">
                    <p>Nenhuma equação registrada no histórico ainda.</p>
                  </div>
                ) : (
                  <div className="history-items-list">
                    <div className="history-actions-header">
                      <button
                        onClick={() => {
                          clearLocalHistory();
                          setHistoryList([]);
                        }}
                        className="clear-history-btn"
                      >
                        <Trash2 size={14} />
                        <span>Limpar Histórico</span>
                      </button>
                    </div>
                    {historyList.map(item => (
                      <div key={item.id} className="history-card-item">
                        <div className="history-item-info">
                          <span className="history-equation-text">{item.inputEquation}</span>
                          {item.balancedEquation !== item.inputEquation && (
                            <span className="history-balanced-text">➔ {item.balancedEquation}</span>
                          )}
                          <span className="history-date">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEquationInput(item.balancedEquation || item.inputEquation);
                            setShowHistoryModal(false);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          <RotateCcw size={14} />
                          <span>Carregar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                favoritesList.length === 0 ? (
                  <div className="empty-modal-state">
                    <p>Nenhuma equação favoritada ainda. Clique no ícone de estrela para favoritar uma reação!</p>
                  </div>
                ) : (
                  <div className="history-items-list">
                    {favoritesList.map(fav => (
                      <div key={fav.id} className="history-card-item">
                        <div className="history-item-info">
                          <span className="history-equation-text">{fav.equation}</span>
                          {fav.name && <span className="fav-name-label">{fav.name}</span>}
                        </div>
                        <div className="fav-item-actions">
                          <button
                            onClick={() => {
                              setEquationInput(fav.equation);
                              setShowHistoryModal(false);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            <RotateCcw size={14} />
                            <span>Carregar</span>
                          </button>
                          <button
                            onClick={async () => {
                              await removeFavorite(fav.equation);
                              refreshStorageData();
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Remover favorito"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
