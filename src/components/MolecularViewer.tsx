import React from 'react';
import { SubstanceParticipant } from '../chemistry/types';
import { getElement } from '../chemistry/periodicTable';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { ArrowRight } from 'lucide-react';
import './MolecularViewer.css';

/**
 * Cores padrão internacionais CPK (Corey-Pauling-Koltun) para esferas atômicas.
 */
export const CPK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  H: { bg: '#f8fafc', text: '#0f172a', border: '#cbd5e1' }, // Branco/Gelo
  C: { bg: '#334155', text: '#ffffff', border: '#1e293b' }, // Grafite/Preto
  N: { bg: '#2563eb', text: '#ffffff', border: '#1d4ed8' }, // Azul
  O: { bg: '#ef4444', text: '#ffffff', border: '#dc2626' }, // Vermelho
  F: { bg: '#4ade80', text: '#0f172a', border: '#22c55e' }, // Verde claro
  Cl: { bg: '#16a34a', text: '#ffffff', border: '#15803d' }, // Verde
  Br: { bg: '#991b1b', text: '#ffffff', border: '#7f1d1d' }, // Marrom/Vinho
  I: { bg: '#7e22ce', text: '#ffffff', border: '#6b21a8' }, // Roxo escuro
  He: { bg: '#38bdf8', text: '#0f172a', border: '#0284c7' }, // Ciano
  Ne: { bg: '#38bdf8', text: '#0f172a', border: '#0284c7' },
  Ar: { bg: '#38bdf8', text: '#0f172a', border: '#0284c7' },
  P: { bg: '#f97316', text: '#ffffff', border: '#ea580c' }, // Laranja
  S: { bg: '#eab308', text: '#0f172a', border: '#ca8a04' }, // Amarelo
  Li: { bg: '#a855f7', text: '#ffffff', border: '#9333ea' }, // Violeta
  Na: { bg: '#8b5cf6', text: '#ffffff', border: '#7c3aed' }, // Violeta claro
  K: { bg: '#7c3aed', text: '#ffffff', border: '#6d28d9' },
  Mg: { bg: '#0d9488', text: '#ffffff', border: '#0f766e' }, // Verde azulado
  Ca: { bg: '#06b6d4', text: '#ffffff', border: '#0891b2' }, // Ciano escuro
  Fe: { bg: '#d97706', text: '#ffffff', border: '#b45309' }, // Laranja ferrugem
  Cu: { bg: '#b45309', text: '#ffffff', border: '#92400e' }, // Cobre
  Zn: { bg: '#64748b', text: '#ffffff', border: '#475569' }, // Zinco cinza
  Ag: { bg: '#e2e8f0', text: '#0f172a', border: '#94a3b8' }, // Prata
  Au: { bg: '#eab308', text: '#0f172a', border: '#ca8a04' }, // Ouro
  default: { bg: '#64748b', text: '#ffffff', border: '#475569' }
};

interface MolecularViewerProps {
  reactants: SubstanceParticipant[];
  products: SubstanceParticipant[];
  isBalanced: boolean;
}

export const MolecularViewer: React.FC<MolecularViewerProps> = ({
  reactants,
  products,
  isBalanced
}) => {
  // Coleta contagem total de átomos por elemento em cada lado
  const getAtomSummary = (participants: SubstanceParticipant[]) => {
    const summary: Record<string, number> = {};
    participants.forEach(p => {
      const coeff = p.coefficient || 1;
      for (const [el, count] of Object.entries(p.parsed.elements)) {
        summary[el] = (summary[el] || 0) + count * coeff;
      }
    });
    return summary;
  };

  const reactantSummary = getAtomSummary(reactants);
  const productSummary = getAtomSummary(products);
  const allElements = Array.from(new Set([...Object.keys(reactantSummary), ...Object.keys(productSummary)])).sort();

  return (
    <section className="molecular-viewer-card">
      <div className="molecular-header">
        <div className="molecular-title-box">
          <div>
            <h3 className="molecular-title">Modelo molecular</h3>
            <p className="molecular-subtitle">
              Cada esfera representa um átomo; as cores seguem o padrão CPK.
            </p>
          </div>
        </div>

        <span className={`molecular-status ${isBalanced ? 'balanced' : 'unbalanced'}`}>
          {isBalanced ? 'Equação balanceada' : 'Equação desbalanceada'}
        </span>
      </div>

      {/* Legenda de Cores CPK */}
      <div className="cpk-legend-bar" aria-label="Legenda das cores dos elementos">
        <span className="legend-label">CPK</span>
        {allElements.map(el => {
          const elData = getElement(el);
          const color = CPK_COLORS[el] || CPK_COLORS.default;
          return (
            <span key={el} className="cpk-legend-item" title={elData?.name || el}>
              <span
                className="legend-sphere"
                style={{ backgroundColor: color.bg, borderColor: color.border }}
                aria-hidden="true"
              />
              {el}
            </span>
          );
        })}
      </div>

      {/* Palco Molecular: Reagentes vs Produtos */}
      <div className="molecular-stage-workbench">
        {/* Lado dos Reagentes */}
        <section className="stage-side" aria-label="Reagentes">
          <div className="stage-side-header">
            <h4 className="side-heading">Reagentes</h4>
          </div>

          <div className="molecules-container">
            {reactants.map((participant, pIdx) => {
              const coeff = participant.coefficient || 1;
              return (
                <div key={`reactant-p-${pIdx}`} className="participant-molecules-group">
                  <div className="participant-header-tag">
                    <span className="p-coeff">{coeff > 1 ? `${coeff}x ` : ''}</span>
                    <span className="p-formula">{formatFormulaDisplay(participant.formula)}</span>
                  </div>

                  <div className="molecules-copies-grid">
                    {Array.from({ length: coeff }).map((_, copyIdx) => (
                      <div key={copyIdx} className="single-molecule-cluster" title={`${participant.formula} (Molécula #${copyIdx + 1})`}>
                        {Object.entries(participant.parsed.elements).map(([elem, count]) => {
                          const cpk = CPK_COLORS[elem] || CPK_COLORS.default;
                          return Array.from({ length: count }).map((_, aIdx) => (
                            <div
                              key={`${elem}-${aIdx}`}
                              className="atom-sphere"
                              style={{
                                backgroundColor: cpk.bg,
                                color: cpk.text,
                                borderColor: cpk.border,
                                transform: `translate(${(aIdx % 3) * 6 - 6}px, ${Math.floor(aIdx / 3) * 6 - 3}px)`
                              }}
                              title={`${elem} (Átomo)`}
                            >
                              <span className="atom-label">{elem}</span>
                            </div>
                          ));
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sumário de Partículas dos Reagentes */}
          <div className="atom-summary-pill-list">
            <span className="summary-title">Total de Átomos:</span>
            {allElements.map(el => (
              <span key={el} className="element-count-pill">
                <strong>{el}:</strong> {reactantSummary[el] || 0}
              </span>
            ))}
          </div>
        </section>

        {/* Divisor de Reação com Seta */}
        <div className="stage-arrow-box">
          <ArrowRight size={32} className="stage-arrow-icon" />
          <span className="stage-arrow-caption">Transformação</span>
        </div>

        {/* Lado dos Produtos */}
        <section className="stage-side" aria-label="Produtos">
          <div className="stage-side-header">
            <h4 className="side-heading">Produtos</h4>
          </div>

          <div className="molecules-container">
            {products.map((participant, pIdx) => {
              const coeff = participant.coefficient || 1;
              return (
                <div key={`product-p-${pIdx}`} className="participant-molecules-group">
                  <div className="participant-header-tag">
                    <span className="p-coeff">{coeff > 1 ? `${coeff}x ` : ''}</span>
                    <span className="p-formula">{formatFormulaDisplay(participant.formula)}</span>
                  </div>

                  <div className="molecules-copies-grid">
                    {Array.from({ length: coeff }).map((_, copyIdx) => (
                      <div key={copyIdx} className="single-molecule-cluster" title={`${participant.formula} (Molécula #${copyIdx + 1})`}>
                        {Object.entries(participant.parsed.elements).map(([elem, count]) => {
                          const cpk = CPK_COLORS[elem] || CPK_COLORS.default;
                          return Array.from({ length: count }).map((_, aIdx) => (
                            <div
                              key={`${elem}-${aIdx}`}
                              className="atom-sphere"
                              style={{
                                backgroundColor: cpk.bg,
                                color: cpk.text,
                                borderColor: cpk.border,
                                transform: `translate(${(aIdx % 3) * 6 - 6}px, ${Math.floor(aIdx / 3) * 6 - 3}px)`
                              }}
                              title={`${elem} (Átomo)`}
                            >
                              <span className="atom-label">{elem}</span>
                            </div>
                          ));
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sumário de Partículas dos Produtos */}
          <div className="atom-summary-pill-list">
            <span className="summary-title">Total de Átomos:</span>
            {allElements.map(el => (
              <span key={el} className="element-count-pill">
                <strong>{el}:</strong> {productSummary[el] || 0}
              </span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};
