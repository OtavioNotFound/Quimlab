import React, { useState } from 'react';
import { SUBSTANCE_CATALOG } from '../chemistry/substanceCatalog';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { parseEquation } from '../chemistry/equationParser';
import { predictReactionProducts } from '../chemistry/productPredictor';
import { Plus, Trash2, ArrowRight, X, Search } from 'lucide-react';
import './VisualEquationBuilder.css';

export interface ParticipantItem {
  formula: string;
  coefficient: number;
}

interface VisualEquationBuilderProps {
  reactants: ParticipantItem[];
  products: ParticipantItem[];
  onChange: (reactants: ParticipantItem[], products: ParticipantItem[]) => void;
  onClose: () => void;
}

export const VisualEquationBuilder: React.FC<VisualEquationBuilderProps> = ({
  reactants,
  products,
  onChange,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [targetSide, setTargetSide] = useState<'reactants' | 'products'>('reactants');
  const reactantExpression = reactants
    .map(item => `${item.coefficient > 1 ? `${item.coefficient} ` : ''}${item.formula}`)
    .join(' + ');
  const productPrediction = products.length === 0
    ? predictReactionProducts(reactantExpression)
    : null;

  // Filtra catálogo para seleção rápida
  const filteredCatalog = SUBSTANCE_CATALOG.filter(s => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.formula.toLowerCase().includes(q) ||
      s.preferredName.toLowerCase().includes(q) ||
      s.commonNames.some(name => name.toLowerCase().includes(q))
    );
  }).slice(0, 10);

  const handleAddSubstance = (formula: string, side: 'reactants' | 'products') => {
    const cleanFormula = formula.trim();
    if (!cleanFormula) return;

    if (side === 'reactants') {
      const existing = reactants.find(r => r.formula === cleanFormula);
      if (existing) {
        onChange(
          reactants.map(r => r.formula === cleanFormula ? { ...r, coefficient: r.coefficient + 1 } : r),
          products
        );
      } else {
        onChange([...reactants, { formula: cleanFormula, coefficient: 1 }], products);
      }
    } else {
      const existing = products.find(p => p.formula === cleanFormula);
      if (existing) {
        onChange(
          reactants,
          products.map(p => p.formula === cleanFormula ? { ...p, coefficient: p.coefficient + 1 } : p)
        );
      } else {
        onChange(reactants, [...products, { formula: cleanFormula, coefficient: 1 }]);
      }
    }
    setCustomInput('');
  };

  const handleUpdateCoeff = (side: 'reactants' | 'products', index: number, delta: number) => {
    if (side === 'reactants') {
      const updated = [...reactants];
      const nextVal = Math.max(1, updated[index].coefficient + delta);
      updated[index] = { ...updated[index], coefficient: nextVal };
      onChange(updated, products);
    } else {
      const updated = [...products];
      const nextVal = Math.max(1, updated[index].coefficient + delta);
      updated[index] = { ...updated[index], coefficient: nextVal };
      onChange(reactants, updated);
    }
  };

  const handleRemove = (side: 'reactants' | 'products', index: number) => {
    if (side === 'reactants') {
      onChange(reactants.filter((_, i) => i !== index), products);
    } else {
      onChange(reactants, products.filter((_, i) => i !== index));
    }
  };

  const handlePredictProducts = () => {
    if (!productPrediction) return;
    const parsed = parseEquation(productPrediction.equation);
    if (!parsed.isValid) return;

    onChange(
      reactants,
      parsed.products.map(product => ({
        formula: product.formula,
        coefficient: product.coefficient
      }))
    );
  };

  return (
    <div className="visual-builder-card card">
      <div className="visual-builder-header">
        <div>
          <h3 className="visual-builder-title">Montador Visual de Reações</h3>
          <p className="visual-builder-subtitle">
            Selecione ou insira substâncias para montar reagentes e produtos visualmente.
          </p>
        </div>
        <button onClick={onClose} className="close-btn" title="Fechar montador visual">
          <X size={20} />
        </button>
      </div>

      {/* Área da Equação Montada */}
      <div className="builder-equation-workbench">
        {/* Reagentes */}
        <div className="workbench-side">
          <div className="side-title-row">
            <span className="side-title-label">Reagentes ({reactants.length})</span>
            <button
              onClick={() => setTargetSide('reactants')}
              className={`add-side-btn ${targetSide === 'reactants' ? 'active' : ''}`}
            >
              Focar Reagentes
            </button>
          </div>
          <div className="side-items-list">
            {reactants.length === 0 ? (
              <span className="empty-side-placeholder">Nenhum reagente selecionado</span>
            ) : (
              reactants.map((item, idx) => (
                <div key={idx} className="builder-item-pill">
                  <div className="coeff-control">
                    <button onClick={() => handleUpdateCoeff('reactants', idx, -1)} className="mini-coeff-btn">-</button>
                    <span className="item-coeff">{item.coefficient}</span>
                    <button onClick={() => handleUpdateCoeff('reactants', idx, 1)} className="mini-coeff-btn">+</button>
                  </div>
                  <span className="item-formula">{formatFormulaDisplay(item.formula)}</span>
                  <button onClick={() => handleRemove('reactants', idx)} className="remove-item-btn" title="Remover">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="builder-arrow-divider">
          <ArrowRight size={24} />
        </div>

        {/* Produtos */}
        <div className="workbench-side">
          <div className="side-title-row">
            <span className="side-title-label">Produtos ({products.length})</span>
            <button
              onClick={() => setTargetSide('products')}
              className={`add-side-btn ${targetSide === 'products' ? 'active' : ''}`}
            >
              Focar Produtos
            </button>
          </div>
          <div className="side-items-list">
            {products.length === 0 ? (
              <div className="empty-products-state">
                <span className="empty-side-placeholder">Nenhum produto selecionado</span>
                {productPrediction && (
                  <button type="button" onClick={handlePredictProducts} className="predict-products-btn">
                    Prever {productPrediction.products.map(formatFormulaDisplay).join(' + ')}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              products.map((item, idx) => (
                <div key={idx} className="builder-item-pill">
                  <div className="coeff-control">
                    <button onClick={() => handleUpdateCoeff('products', idx, -1)} className="mini-coeff-btn">-</button>
                    <span className="item-coeff">{item.coefficient}</span>
                    <button onClick={() => handleUpdateCoeff('products', idx, 1)} className="mini-coeff-btn">+</button>
                  </div>
                  <span className="item-formula">{formatFormulaDisplay(item.formula)}</span>
                  <button onClick={() => handleRemove('products', idx)} className="remove-item-btn" title="Remover">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Painel de Adição de Substâncias */}
      <div className="substance-picker-panel">
        <div className="picker-header">
          <span className="picker-title">
            Adicionar a: <strong className="target-side-badge">{targetSide === 'reactants' ? 'Reagentes' : 'Produtos'}</strong>
          </span>
          <div className="custom-input-box">
            <input
              type="text"
              placeholder="Digitar fórmula customizada (ex: KMnO4)..."
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddSubstance(customInput, targetSide);
              }}
              className="custom-formula-input"
            />
            <button
              onClick={() => handleAddSubstance(customInput, targetSide)}
              disabled={!customInput.trim()}
              className="btn btn-secondary btn-sm"
            >
              <Plus size={16} />
              <span>Inserir</span>
            </button>
          </div>
        </div>

        <div className="catalog-quick-search">
          <div className="quick-search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar substância do catálogo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="quick-search-input"
            />
          </div>

          <div className="quick-substances-grid">
            {filteredCatalog.map(sub => (
              <button
                key={sub.id ?? `${sub.formula}-${sub.preferredName}`}
                onClick={() => handleAddSubstance(sub.formula, targetSide)}
                className="quick-sub-btn"
                title={`${sub.preferredName} (${sub.substanceType})`}
              >
                <span className="sub-btn-formula">{formatFormulaDisplay(sub.formula)}</span>
                <span className="sub-btn-name">{sub.preferredName}</span>
                <Plus size={14} className="add-sub-icon" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
