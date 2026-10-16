import React, { useMemo, useRef, useState } from 'react';
import {
  Atom,
  Check,
  Eraser,
  FlaskConical,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
  WandSparkles
} from 'lucide-react';
import {
  BondOrder,
  BUILDER_ELEMENTS,
  calculateMolecularFormula,
  calculateMolecularMass,
  completeWithHydrogens,
  createMoleculeFromTemplate,
  ELEMENT_COLORS,
  getAtomBondOrder,
  MOLECULE_TEMPLATES,
  MoleculeAtom,
  MoleculeBond,
  TYPICAL_VALENCE,
  validateMolecule
} from '../chemistry/moleculeBuilder';
import { getElement } from '../chemistry/periodicTable';
import { SUBSTANCE_CATALOG } from '../chemistry/substanceCatalog';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import './MoleculeBuilderPage.css';

interface MoleculeState {
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

type Selection = { type: 'atom' | 'bond'; id: string } | null;

const EMPTY_STATE: MoleculeState = { atoms: [], bonds: [] };

export const MoleculeBuilderPage: React.FC = () => {
  const [history, setHistory] = useState<MoleculeState[]>([EMPTY_STATE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>(null);
  const [bondOrder, setBondOrder] = useState<BondOrder>(1);
  const [draggingAtom, setDraggingAtom] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState('water');
  const svgRef = useRef<SVGSVGElement>(null);

  const current = history[historyIndex];
  const formula = calculateMolecularFormula(current.atoms);
  const molarMass = calculateMolecularMass(current.atoms);
  const validation = validateMolecule(current.atoms, current.bonds);
  const catalogMatches = useMemo(() => (
    formula ? SUBSTANCE_CATALOG.filter(item => item.formula === formula).slice(0, 3) : []
  ), [formula]);
  const challenge = MOLECULE_TEMPLATES.find(item => item.id === challengeId) ?? MOLECULE_TEMPLATES[0];
  const challengeComplete = validation.status === 'valid' && formula === challenge.formula;

  const commit = (next: MoleculeState) => {
    const nextHistory = [...history.slice(0, historyIndex + 1), next];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const replaceCurrent = (next: MoleculeState) => {
    setHistory(previous => previous.map((state, index) => index === historyIndex ? next : state));
  };

  const addAtom = (symbol: string) => {
    const index = current.atoms.length;
    const angle = index * 2.32;
    const radius = Math.min(175, 32 + index * 13);
    const atom: MoleculeAtom = {
      id: `atom-${nextNumericId(current.atoms.map(item => item.id), 'atom-')}`,
      symbol,
      x: 450 + Math.cos(angle) * radius,
      y: 255 + Math.sin(angle) * radius
    };
    commit({ ...current, atoms: [...current.atoms, atom] });
    setSelection({ type: 'atom', id: atom.id });
  };

  const selectAtom = (atomId: string) => {
    if (selection?.type !== 'atom' || selection.id === atomId) {
      setSelection(selection?.type === 'atom' && selection.id === atomId ? null : { type: 'atom', id: atomId });
      return;
    }

    const atomA = selection.id;
    const existing = current.bonds.find(bond => (
      (bond.atomA === atomA && bond.atomB === atomId) || (bond.atomA === atomId && bond.atomB === atomA)
    ));
    const bonds = existing
      ? current.bonds.map(bond => bond.id === existing.id ? { ...bond, order: bondOrder } : bond)
      : [...current.bonds, {
          id: `bond-${nextNumericId(current.bonds.map(item => item.id), 'bond-')}`,
          atomA,
          atomB: atomId,
          order: bondOrder
        }];
    commit({ ...current, bonds });
    setSelection(null);
  };

  const removeSelection = () => {
    if (!selection) return;
    if (selection.type === 'atom') {
      commit({
        atoms: current.atoms.filter(atom => atom.id !== selection.id),
        bonds: current.bonds.filter(bond => bond.atomA !== selection.id && bond.atomB !== selection.id)
      });
    } else {
      commit({ ...current, bonds: current.bonds.filter(bond => bond.id !== selection.id) });
    }
    setSelection(null);
  };

  const loadTemplate = (templateId: string) => {
    const template = MOLECULE_TEMPLATES.find(item => item.id === templateId);
    if (!template) return;
    commit(createMoleculeFromTemplate(template));
    setChallengeId(template.id);
    setSelection(null);
  };

  const clearBuilder = () => {
    if (current.atoms.length === 0) return;
    commit(EMPTY_STATE);
    setSelection(null);
  };

  const addHydrogens = () => {
    const completed = completeWithHydrogens(current.atoms, current.bonds);
    if (completed.atoms.length === current.atoms.length) return;
    commit(completed);
    setSelection(null);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingAtom || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 900;
    const y = ((event.clientY - rect.top) / rect.height) * 520;
    replaceCurrent({
      ...current,
      atoms: current.atoms.map(atom => atom.id === draggingAtom
        ? { ...atom, x: clamp(x, 36, 864), y: clamp(y, 36, 484) }
        : atom)
    });
  };

  const undo = () => {
    if (historyIndex === 0) return;
    setHistoryIndex(index => index - 1);
    setSelection(null);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex(index => index + 1);
    setSelection(null);
  };

  return (
    <div className="molecule-page container">
      <header className="molecule-hero">
        <div>
          <span className="molecule-kicker">Bancada molecular · modo livre</span>
          <h1>Monte a matéria, ligação por ligação.</h1>
        </div>
        <p>
          Escolha os átomos, conecte-os e observe a fórmula, a massa e as valências mudarem enquanto você constrói.
        </p>
      </header>

      <section className="molecule-builder-shell" aria-label="Construtor de moléculas">
        <div className="molecule-toolbar">
          <div className="tool-group" aria-label="Histórico de edição">
            <button type="button" onClick={undo} disabled={historyIndex === 0} title="Desfazer"><Undo2 size={17} /> Desfazer</button>
            <button type="button" onClick={redo} disabled={historyIndex >= history.length - 1} title="Refazer"><Redo2 size={17} /> Refazer</button>
          </div>
          <div className="tool-group bond-tools" aria-label="Ordem da ligação">
            <span>Ligação</span>
            {([1, 2, 3] as BondOrder[]).map(order => (
              <button
                type="button"
                key={order}
                onClick={() => setBondOrder(order)}
                className={bondOrder === order ? 'active' : ''}
                aria-pressed={bondOrder === order}
              >
                {order === 1 ? '—' : order === 2 ? '=' : '≡'}
                <span className="sr-only">{order === 1 ? 'simples' : order === 2 ? 'dupla' : 'tripla'}</span>
              </button>
            ))}
          </div>
          <div className="tool-group toolbar-end">
            <button type="button" onClick={addHydrogens} disabled={!current.atoms.some(atom => atom.symbol !== 'H')}>
              <WandSparkles size={17} /> Completar H
            </button>
            <button type="button" onClick={removeSelection} disabled={!selection}><Eraser size={17} /> Remover seleção</button>
            <button type="button" onClick={clearBuilder} disabled={current.atoms.length === 0}><Trash2 size={17} /> Limpar</button>
          </div>
        </div>

        <div className="builder-main-grid">
          <aside className="atom-drawer" aria-label="Átomos disponíveis">
            <div className="drawer-heading">
              <span>Átomos</span>
              <small>Clique para adicionar</small>
            </div>
            <div className="atom-palette">
              {BUILDER_ELEMENTS.map(symbol => {
                const element = getElement(symbol)!;
                return (
                  <button
                    type="button"
                    key={symbol}
                    onClick={() => addAtom(symbol)}
                    className={`palette-atom palette-${symbol.toLowerCase()}`}
                    style={{ '--atom-color': ELEMENT_COLORS[symbol] } as React.CSSProperties}
                    title={`Adicionar ${element.name}`}
                  >
                    <span>{symbol}</span>
                    <small>{element.name}</small>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="molecule-stage-wrap">
            <div className="stage-instruction">
              <Atom size={17} />
              <span>Selecione um átomo e depois outro para criar uma ligação. Arraste para organizar.</span>
            </div>
            <svg
              ref={svgRef}
              className="molecule-stage"
              viewBox="0 0 900 520"
              role="img"
              aria-label={formula ? `Molécula em construção: ${formula}` : 'Área vazia para montar uma molécula'}
              onPointerMove={handlePointerMove}
              onPointerUp={() => setDraggingAtom(null)}
              onPointerLeave={() => setDraggingAtom(null)}
            >
              <defs>
                <pattern id="builder-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" className="stage-grid-dot" />
                </pattern>
              </defs>
              <rect width="900" height="520" fill="url(#builder-grid)" />

              {current.bonds.map(bond => {
                const atomA = current.atoms.find(atom => atom.id === bond.atomA)!;
                const atomB = current.atoms.find(atom => atom.id === bond.atomB)!;
                return (
                  <g
                    key={bond.id}
                    className={`stage-bond ${selection?.type === 'bond' && selection.id === bond.id ? 'selected' : ''}`}
                    onClick={() => setSelection({ type: 'bond', id: bond.id })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') setSelection({ type: 'bond', id: bond.id });
                    }}
                    aria-label={`Ligação ${bond.order === 1 ? 'simples' : bond.order === 2 ? 'dupla' : 'tripla'} entre ${atomA.symbol} e ${atomB.symbol}`}
                  >
                    {bondLineOffsets(bond.order).map(offset => {
                      const line = offsetLine(atomA, atomB, offset);
                      return <line key={offset} {...line} />;
                    })}
                    <line className="bond-hit-area" x1={atomA.x} y1={atomA.y} x2={atomB.x} y2={atomB.y} />
                  </g>
                );
              })}

              {current.atoms.map(atom => {
                const element = getElement(atom.symbol)!;
                const isSelected = selection?.type === 'atom' && selection.id === atom.id;
                const issue = validation.atomIssues[atom.id];
                const darkText = !['C', 'N', 'O', 'Cl', 'Br', 'I'].includes(atom.symbol);
                return (
                  <g
                    key={atom.id}
                    className={`stage-atom ${isSelected ? 'selected' : ''} ${issue ? 'has-issue' : ''}`}
                    transform={`translate(${atom.x} ${atom.y})`}
                    onClick={() => selectAtom(atom.id)}
                    onPointerDown={event => {
                      setDraggingAtom(atom.id);
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') selectAtom(atom.id);
                    }}
                    aria-label={`${element.name}, ${getAtomBondOrder(atom.id, current.bonds)} de ${TYPICAL_VALENCE[atom.symbol]} ligações`}
                  >
                    <circle r="30" fill={ELEMENT_COLORS[atom.symbol]} />
                    <circle className="atom-ring" r="35" />
                    <text className={darkText ? 'dark-atom-label' : ''} textAnchor="middle" dominantBaseline="central">{atom.symbol}</text>
                    {issue && <circle className="issue-dot" cx="25" cy="-25" r="6" />}
                  </g>
                );
              })}

              {current.atoms.length === 0 && (
                <g className="empty-stage" transform="translate(450 255)">
                  <circle r="54" />
                  <text textAnchor="middle" y="7">+</text>
                  <text className="empty-stage-label" textAnchor="middle" y="94">Escolha um átomo na bandeja</text>
                </g>
              )}
            </svg>
          </div>

          <aside className="molecule-inspector" aria-label="Análise da molécula">
            <div className="formula-readout">
              <span>Fórmula atual</span>
              <strong>{formula ? formatFormulaDisplay(formula) : '—'}</strong>
              <small>
                {current.atoms.length} átomo{current.atoms.length === 1 ? '' : 's'} ·{' '}
                {current.bonds.length} {current.bonds.length === 1 ? 'ligação' : 'ligações'}
              </small>
            </div>

            <dl className="molecule-facts">
              <div><dt>Massa molar</dt><dd>{molarMass ? `${molarMass.toFixed(2)} g/mol` : '—'}</dd></div>
              <div><dt>Estrutura</dt><dd>{validation.status === 'valid' ? 'Completa' : validation.status === 'empty' ? 'Vazia' : 'Em construção'}</dd></div>
            </dl>

            <div className={`validation-note status-${validation.status}`}>
              {validation.status === 'valid' ? <Check size={18} /> : <FlaskConical size={18} />}
              <p>{validation.message}</p>
            </div>

            <div className="identity-block">
              <span>Identificação provável</span>
              {catalogMatches.length > 0 ? (
                <div className="identity-list">
                  {catalogMatches.map(match => (
                    <div key={match.id ?? match.preferredName}>
                      <strong>{match.preferredName}</strong>
                      <small>{match.substanceType}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{formula ? 'A fórmula ainda não corresponde a uma entrada reconhecida do catálogo.' : 'A identificação aparece conforme você monta.'}</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="molecule-lower-grid">
        <div className="molecule-templates">
          <div className="section-copy">
            <span>Estruturas de partida</span>
            <h2>Abra, desmonte, reconstrua.</h2>
            <p>Use uma molécula conhecida como referência ou ponto de partida para testar outras ligações.</p>
          </div>
          <div className="template-list">
            {MOLECULE_TEMPLATES.map(item => (
              <button type="button" key={item.id} onClick={() => loadTemplate(item.id)}>
                <span>{formatFormulaDisplay(item.formula)}</span>
                <strong>{item.name}</strong>
                <small>{item.atoms.length} átomos</small>
              </button>
            ))}
          </div>
        </div>

        <aside className={`molecule-challenge ${challengeComplete ? 'complete' : ''}`}>
          <div>
            <span>Desafio da bancada</span>
            <h2>Monte {challenge.name}</h2>
            <p>Chegue à fórmula <strong>{formatFormulaDisplay(challenge.formula)}</strong> com todos os átomos conectados e as valências completas.</p>
          </div>
          <div className="challenge-switcher">
            {MOLECULE_TEMPLATES.slice(0, 6).map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setChallengeId(item.id);
                  clearBuilder();
                }}
                className={challengeId === item.id ? 'active' : ''}
              >
                {formatFormulaDisplay(item.formula)}
              </button>
            ))}
          </div>
          <div className="challenge-status">
            {challengeComplete ? <><Check size={19} /> Estrutura concluída</> : <><RotateCcw size={18} /> Continue experimentando</>}
          </div>
        </aside>
      </section>
    </div>
  );
};

function nextNumericId(ids: string[], prefix: string): number {
  return Math.max(0, ...ids.map(id => Number(id.replace(prefix, '')) || 0)) + 1;
}

function bondLineOffsets(order: BondOrder): number[] {
  if (order === 1) return [0];
  if (order === 2) return [-5, 5];
  return [-8, 0, 8];
}

function offsetLine(atomA: MoleculeAtom, atomB: MoleculeAtom, offset: number) {
  const dx = atomB.x - atomA.x;
  const dy = atomB.y - atomA.y;
  const length = Math.hypot(dx, dy) || 1;
  const offsetX = (-dy / length) * offset;
  const offsetY = (dx / length) * offset;
  return {
    x1: atomA.x + offsetX,
    y1: atomA.y + offsetY,
    x2: atomB.x + offsetX,
    y2: atomB.y + offsetY
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
