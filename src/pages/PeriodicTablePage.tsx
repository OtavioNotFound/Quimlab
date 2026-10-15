import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllElements } from '../chemistry/periodicTable';
import { ElementData } from '../chemistry/types';
import { Search, Plus, X } from 'lucide-react';
import './PeriodicTablePage.css';

const CATEGORY_COLORS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  alkali_metal: { label: 'Metais Alcalinos', bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: '#f87171' },
  alkaline_earth_metal: { label: 'Alcalino-Terrosos', bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316', border: '#fb923c' },
  transition_metal: { label: 'Metais de Transição', bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', border: '#facc15' },
  post_transition_metal: { label: 'Pós-Transição', bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: '#4ade80' },
  metalloid: { label: 'Semimetais (Metaloides)', bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4', border: '#22d3ee' },
  nonmetal: { label: 'Não Metais Reativos', bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: '#60a5fa' },
  halogen: { label: 'Halogênios', bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7', border: '#c084fc' },
  noble_gas: { label: 'Gases Nobres', bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899', border: '#f472b6' },
  lanthanide: { label: 'Lantanídeos', bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#34d399' },
  actinide: { label: 'Actinídeos', bg: 'rgba(217, 70, 239, 0.15)', text: '#d946ef', border: '#e879f9' }
};

export const PeriodicTablePage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  const elements = useMemo(() => getAllElements(), []);

  const filteredElements = useMemo(() => {
    return elements.filter(el => {
      if (selectedCategory !== 'all' && el.category !== selectedCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        el.atomicNumber.toString() === q
      );
    });
  }, [elements, search, selectedCategory]);

  const handleUseInSimulator = (symbol: string) => {
    navigate(`/?add=${symbol}`);
  };

  return (
    <div className="periodic-page container">
      <header className="folio-header">
        <div>
          <p className="page-kicker">Elementos</p>
          <h1 className="periodic-title">Tabela periódica</h1>
        </div>
        <p className="periodic-subtitle">
          Propriedades atômicas, massas padronizadas, eletronegatividade e estados de oxidação. Clique em um elemento para abrir a ficha.
        </p>
      </header>

      <div className="periodic-controls">
        <div className="search-box-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por símbolo, nome ou número atômico (ex: Fe, Ferro, 26)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="periodic-search-input"
            />
          </div>
          {search && (
            <button onClick={() => setSearch('')} className="btn btn-secondary btn-sm">
              Limpar
            </button>
          )}
        </div>

        {/* Chips de Categorias / Famílias */}
        <div className="category-chips-list">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`cat-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            Todas as Famílias ({elements.length})
          </button>
          {Object.entries(CATEGORY_COLORS).map(([catKey, catData]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`cat-chip ${selectedCategory === catKey ? 'active' : ''}`}
              style={{
                borderColor: selectedCategory === catKey ? catData.text : undefined,
                color: selectedCategory === catKey ? catData.text : undefined
              }}
            >
              <span className="cat-dot" style={{ backgroundColor: catData.text }} />
              <span>{catData.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grade da Tabela Periódica */}
      <div className="table-scroll-wrapper">
        <div className="periodic-grid-18">
          {elements.map(el => {
            const cat = CATEGORY_COLORS[el.category] || CATEGORY_COLORS.nonmetal;
            const isMatch = filteredElements.some(f => f.symbol === el.symbol);
            const isSelected = selectedElement?.symbol === el.symbol;

            // Coordenadas na grade periódica (1 a 7 períodos, 1 a 18 grupos)
            const gridCol = el.group || 1;
            const gridRow = el.period || 1;

            return (
              <div
                key={el.symbol}
                onClick={() => setSelectedElement(el)}
                className={`element-grid-cell ${isMatch ? 'match' : 'dimmed'} ${isSelected ? 'selected' : ''}`}
                style={{
                  gridColumn: gridCol,
                  gridRow: gridRow,
                  backgroundColor: cat.bg,
                  borderColor: isSelected ? 'var(--accent-primary)' : cat.border
                }}
                title={`${el.name} (${el.symbol}), nº ${el.atomicNumber}`}
              >
                <div className="cell-top">
                  <span className="cell-num">{el.atomicNumber}</span>
                  <span className="cell-mass">{el.atomicMass.toFixed(1)}</span>
                </div>
                <span className="cell-symbol" style={{ color: cat.text }}>
                  {el.symbol}
                </span>
                <span className="cell-name">{el.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhes do Elemento Selecionado (Drawer/Modal) */}
      {selectedElement && (
        <div className="element-detail-overlay" onClick={() => setSelectedElement(null)}>
          <div className="element-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <div className="element-badge-large" style={{ borderColor: CATEGORY_COLORS[selectedElement.category]?.border }}>
                <span className="badge-num">{selectedElement.atomicNumber}</span>
                <span className="badge-sym" style={{ color: CATEGORY_COLORS[selectedElement.category]?.text }}>
                  {selectedElement.symbol}
                </span>
                <span className="badge-mass">{selectedElement.atomicMass} g/mol</span>
              </div>

              <div className="element-header-info">
                <h3>{selectedElement.name}</h3>
                <span className="element-cat-tag">
                  {CATEGORY_COLORS[selectedElement.category]?.label || selectedElement.category}
                </span>
                <p className="element-coords">
                  Período: <strong>{selectedElement.period}</strong> | Grupo/Família: <strong>{selectedElement.group}</strong>
                </p>
              </div>

              <button onClick={() => setSelectedElement(null)} className="close-btn" title="Fechar">
                <X size={20} />
              </button>
            </div>

            <div className="modal-properties-grid">
              <div className="prop-box">
                <span className="prop-label">Massa Atômica Padrão</span>
                <span className="prop-val font-mono">{selectedElement.atomicMass} u</span>
              </div>
              <div className="prop-box">
                <span className="prop-label">Eletronegatividade (Pauling)</span>
                <span className="prop-val font-mono">
                  {selectedElement.electronegativity ? `${selectedElement.electronegativity}` : 'Não aplicável'}
                </span>
              </div>
              <div className="prop-box">
                <span className="prop-label">Estados de Oxidação Comuns (Nox)</span>
                <span className="prop-val font-mono font-bold">
                  {selectedElement.commonOxidationStates?.map(n => (n > 0 ? `+${n}` : `${n}`)).join(', ') || '0'}
                </span>
              </div>
              <div className="prop-box">
                <span className="prop-label">Configuração Eletrônica</span>
                <span className="prop-val font-mono">
                  {selectedElement.electronConfiguration || 'Consulte tabela espectroscópica'}
                </span>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button
                onClick={() => handleUseInSimulator(selectedElement.symbol)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                <span>Usar no Simulador ({selectedElement.symbol})</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedElement.symbol);
                }}
                className="btn btn-secondary"
              >
                <span>Copiar Símbolo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
