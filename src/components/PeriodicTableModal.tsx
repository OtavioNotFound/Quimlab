import React, { useState, useMemo } from 'react';
import { getAllElements } from '../chemistry/periodicTable';
import { ElementData } from '../chemistry/types';
import { Search, X, Plus } from 'lucide-react';
import './PeriodicTableModal.css';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElement: (symbol: string) => void;
}

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  onSelectElement
}) => {
  const [search, setSearch] = useState('');
  const [selectedEl, setSelectedEl] = useState<ElementData | null>(null);

  const elements = useMemo(() => getAllElements(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return elements;
    const q = search.toLowerCase().trim();
    return elements.filter(el =>
      el.name.toLowerCase().includes(q) ||
      el.symbol.toLowerCase().includes(q) ||
      el.atomicNumber.toString() === q
    );
  }, [elements, search]);

  if (!isOpen) return null;

  return (
    <div className="periodic-modal-backdrop" onClick={onClose}>
      <div className="periodic-modal-window card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Tabela Periódica Interativa</h3>
            <p className="modal-subtitle">Selecione um elemento para inserir diretamente na equação química.</p>
          </div>
          <button onClick={onClose} className="close-btn" title="Fechar modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-search-row">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar elemento por nome, símbolo ou número (ex: Fe, Ferro, 26)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="modal-search-input"
            autoFocus
          />
        </div>

        <div className="quick-elements-scroll-grid">
          {filtered.map(el => (
            <div
              key={el.symbol}
              onClick={() => setSelectedEl(el)}
              className={`quick-el-chip ${selectedEl?.symbol === el.symbol ? 'active' : ''}`}
            >
              <span className="chip-num">{el.atomicNumber}</span>
              <span className="chip-sym">{el.symbol}</span>
              <span className="chip-name">{el.name}</span>
            </div>
          ))}
        </div>

        {selectedEl && (
          <div className="selected-el-drawer">
            <div className="drawer-left">
              <span className="drawer-sym">{selectedEl.symbol}</span>
              <div>
                <h4>{selectedEl.name} (Nº {selectedEl.atomicNumber})</h4>
                <p className="drawer-info">
                  Massa: <strong>{selectedEl.atomicMass} u</strong> | Nox Comuns: <strong>{selectedEl.commonOxidationStates?.join(', ') || '0'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectElement(selectedEl.symbol);
                onClose();
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Inserir {selectedEl.symbol} na Equação</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
