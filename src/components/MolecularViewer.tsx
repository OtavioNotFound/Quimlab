import React from 'react';
import { SubstanceParticipant } from '../chemistry/types';
import { getElement } from '../chemistry/periodicTable';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { createMoleculeFromTemplate, MOLECULE_TEMPLATES, MoleculeTemplate } from '../chemistry/moleculeBuilder';
import { ArrowRight } from 'lucide-react';
import './MolecularViewer.css';

/** Cores padrão internacionais CPK (Corey-Pauling-Koltun) para esferas atômicas. */
export const CPK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  H: { bg: '#f8fafc', text: '#0f172a', border: '#cbd5e1' },
  C: { bg: '#334155', text: '#ffffff', border: '#1e293b' },
  N: { bg: '#2563eb', text: '#ffffff', border: '#1d4ed8' }, // taste-skill-ignore: cores CPK padronizadas
  O: { bg: '#ef4444', text: '#ffffff', border: '#dc2626' }, // taste-skill-ignore: cores CPK padronizadas
  F: { bg: '#4ade80', text: '#0f172a', border: '#22c55e' }, // taste-skill-ignore: cores CPK padronizadas
  Cl: { bg: '#16a34a', text: '#ffffff', border: '#15803d' },
  Br: { bg: '#991b1b', text: '#ffffff', border: '#7f1d1d' },
  I: { bg: '#7e22ce', text: '#ffffff', border: '#6b21a8' },
  He: { bg: '#38bdf8', text: '#0f172a', border: '#0284c7' },
  Ne: { bg: '#38bdf8', text: '#0f172a', border: '#0284c7' },
  Ar: { bg: '#38bdf8', text: '#0f172a', border: '#0284c7' },
  P: { bg: '#f97316', text: '#ffffff', border: '#ea580c' },
  S: { bg: '#eab308', text: '#0f172a', border: '#ca8a04' },
  Li: { bg: '#a855f7', text: '#ffffff', border: '#9333ea' }, // taste-skill-ignore: cores CPK padronizadas
  Na: { bg: '#8b5cf6', text: '#ffffff', border: '#7c3aed' }, // taste-skill-ignore: cores CPK padronizadas
  K: { bg: '#7c3aed', text: '#ffffff', border: '#6d28d9' }, // taste-skill-ignore: cores CPK padronizadas
  Mg: { bg: '#0d9488', text: '#ffffff', border: '#0f766e' },
  Ca: { bg: '#06b6d4', text: '#ffffff', border: '#0891b2' },
  Fe: { bg: '#d97706', text: '#ffffff', border: '#b45309' },
  Cu: { bg: '#b45309', text: '#ffffff', border: '#92400e' },
  Zn: { bg: '#64748b', text: '#ffffff', border: '#475569' },
  Ag: { bg: '#e2e8f0', text: '#0f172a', border: '#94a3b8' },
  Au: { bg: '#eab308', text: '#0f172a', border: '#ca8a04' },
  default: { bg: '#64748b', text: '#ffffff', border: '#475569' }
};

interface MolecularViewerProps {
  reactants: SubstanceParticipant[];
  products: SubstanceParticipant[];
  isBalanced: boolean;
}

const VIEWER_STRUCTURES: MoleculeTemplate[] = [
  ...MOLECULE_TEMPLATES,
  { id: 'hydrogen', name: 'Hidrogênio', formula: 'H2', atoms: [{ symbol: 'H', x: 390, y: 255 }, { symbol: 'H', x: 510, y: 255 }], bonds: [[0, 1, 1]] },
  { id: 'hydrogen-chloride', name: 'Cloreto de hidrogênio', formula: 'HCl', atoms: [{ symbol: 'H', x: 390, y: 255 }, { symbol: 'Cl', x: 510, y: 255 }], bonds: [[0, 1, 1]] },
  { id: 'hydrogen-fluoride', name: 'Fluoreto de hidrogênio', formula: 'HF', atoms: [{ symbol: 'H', x: 390, y: 255 }, { symbol: 'F', x: 510, y: 255 }], bonds: [[0, 1, 1]] },
  { id: 'hydrogen-peroxide', name: 'Peróxido de hidrogênio', formula: 'H2O2', atoms: [{ symbol: 'H', x: 300, y: 195 }, { symbol: 'O', x: 400, y: 255 }, { symbol: 'O', x: 500, y: 255 }, { symbol: 'H', x: 600, y: 315 }], bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1]] },
  { id: 'carbon-monoxide', name: 'Monóxido de carbono', formula: 'CO', atoms: [{ symbol: 'C', x: 390, y: 255 }, { symbol: 'O', x: 510, y: 255 }], bonds: [[0, 1, 3]] },
  { id: 'hydrogen-cyanide', name: 'Cianeto de hidrogênio', formula: 'HCN', atoms: [{ symbol: 'H', x: 330, y: 255 }, { symbol: 'C', x: 450, y: 255 }, { symbol: 'N', x: 570, y: 255 }], bonds: [[0, 1, 1], [1, 2, 3]] }
];

export function MolecularUnit({ formula, title, elements, animated = false, highlighted = null }: { formula: string; title: string; elements: Record<string, number>; animated?: boolean; highlighted?: string | null }) {
  const structure = VIEWER_STRUCTURES.find(item => item.formula === formula);

  if (!structure) {
    return (
      <div className={`molecule-unit${animated ? ' moving-molecule' : ''}`}>
        <div className="molecule-composition" aria-label={`Composição de ${title}`}>
          {Object.entries(elements).map(([symbol, count]) => (
            <span key={symbol} className="composition-atom" style={atomStyle(symbol)}>
              {symbol}{count > 1 ? <small>×{count}</small> : null}
            </span>
          ))}
        </div>
        <span className="molecule-structure-note">Composição · estrutura não definida</span>
      </div>
    );
  }

  const graph = createMoleculeFromTemplate(structure);
  const byId = new Map(graph.atoms.map(atom => [atom.id, atom]));
  const coords = (x: number, y: number) => ({ x: 60 + (x - 450) * 0.3, y: 50 + (y - 255) * 0.3 });

  return (
    <div className={`molecule-unit${animated ? ' moving-molecule' : ''}`} title={title}>
      <svg className="molecule-diagram" viewBox="0 0 120 100" role="img" aria-label={`${structure.name}: ${formatFormulaDisplay(formula)}`}>
        <g className="molecule-bonds" aria-hidden="true">
          {graph.bonds.flatMap(bond => {
            const a = byId.get(bond.atomA)!;
            const b = byId.get(bond.atomB)!;
            const start = coords(a.x, a.y);
            const end = coords(b.x, b.y);
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const length = Math.hypot(dx, dy) || 1;
            const nx = -dy / length * 3.2;
            const ny = dx / length * 3.2;
            return Array.from({ length: bond.order }, (_, index) => {
              const offset = (index - (bond.order - 1) / 2);
              const edge = (point: typeof start, other: typeof end, sign: number) => {
                const vx = other.x - point.x;
                const vy = other.y - point.y;
                const span = Math.hypot(vx, vy) || 1;
                return { x: point.x + vx / span * 11 + nx * offset * sign, y: point.y + vy / span * 11 + ny * offset * sign };
              };
              const from = edge(start, end, 1);
              const to = edge(end, start, -1);
              return <line key={`${bond.id}-${index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
            });
          })}
        </g>
        {graph.atoms.map(atom => {
          const point = coords(atom.x, atom.y);
          const radius = atom.symbol.length > 1 ? 10 : 9;
          return (
            <g key={atom.id} className={`molecule-atom${highlighted && highlighted !== atom.symbol ? ' atom-dimmed' : ''}`}>
              <circle cx={point.x} cy={point.y} r={radius} style={atomStyle(atom.symbol)} />
              <text x={point.x} y={point.y + 0.5} style={{ fill: (CPK_COLORS[atom.symbol] || CPK_COLORS.default).text }}>{atom.symbol}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function atomStyle(symbol: string): React.CSSProperties {
  const cpk = CPK_COLORS[symbol] || CPK_COLORS.default;
  return {
    fill: cpk.bg,
    color: cpk.text,
    stroke: cpk.border,
    backgroundColor: cpk.bg,
    borderColor: cpk.border
  };
}

export const MolecularViewer: React.FC<MolecularViewerProps> = ({ reactants, products, isBalanced }) => {
  const getAtomSummary = (participants: SubstanceParticipant[]) => {
    const summary: Record<string, number> = {};
    participants.forEach(participant => {
      for (const [element, count] of Object.entries(participant.parsed.elements)) {
        summary[element] = (summary[element] || 0) + count * (participant.coefficient || 1);
      }
    });
    return summary;
  };
  const reactantSummary = getAtomSummary(reactants);
  const productSummary = getAtomSummary(products);
  const allElements = Array.from(new Set([...Object.keys(reactantSummary), ...Object.keys(productSummary)])).sort();

  const renderSide = (participants: SubstanceParticipant[], label: string, summary: Record<string, number>) => (
    <section className="stage-side" aria-label={label}>
      <div className="stage-side-header"><h4 className="side-heading">{label}</h4></div>
      <div className="molecules-container">
        {participants.map((participant, index) => {
          const coefficient = participant.coefficient || 1;
          return (
            <div key={`${label}-${index}`} className="participant-molecules-group">
              <div className="participant-header-tag">
                {coefficient > 1 ? <span className="p-coeff">{coefficient}× </span> : null}
                <span className="p-formula">{formatFormulaDisplay(participant.formula)}</span>
              </div>
              <div className="molecules-copies-grid">
                {Array.from({ length: coefficient }, (_, copy) => (
                  <MolecularUnit key={copy} formula={participant.parsed.cleanFormula} title={`${participant.formula} · ${copy + 1}/${coefficient}`} elements={participant.parsed.elements} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="atom-summary-pill-list">
        <span className="summary-title">Total de átomos:</span>
        {allElements.map(element => (
          <span key={element} className="element-count-pill"><strong>{element}:</strong> {summary[element] || 0}</span>
        ))}
      </div>
    </section>
  );

  return (
    <section className="molecular-viewer-card">
      <div className="molecular-header">
        <div className="molecular-title-box"><div>
          <h3 className="molecular-title">Modelo molecular</h3>
          <p className="molecular-subtitle">Ligações nas estruturas conhecidas; composição nas demais fórmulas.</p>
        </div></div>
        <span className={`molecular-status ${isBalanced ? 'balanced' : 'unbalanced'}`}>
          {isBalanced ? 'Equação balanceada' : 'Equação desbalanceada'}
        </span>
      </div>
      <div className="cpk-legend-bar" aria-label="Legenda das cores dos elementos">
        <span className="legend-label">CPK</span>
        {allElements.map(element => {
          const color = CPK_COLORS[element] || CPK_COLORS.default;
          return <span key={element} className="cpk-legend-item" title={getElement(element)?.name || element}>
            <span className="legend-sphere" style={{ backgroundColor: color.bg, borderColor: color.border }} aria-hidden="true" />{element}
          </span>;
        })}
      </div>
      <div className="molecular-stage-workbench">
        {renderSide(reactants, 'Reagentes', reactantSummary)}
        <div className="stage-arrow-box"><ArrowRight size={32} className="stage-arrow-icon" /><span className="stage-arrow-caption">Transformação</span></div>
        {renderSide(products, 'Produtos', productSummary)}
      </div>
    </section>
  );
};
