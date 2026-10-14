import { AtomBalanceRow, SubstanceParticipant } from '../chemistry/types';
import { CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import './AtomCounterTable.css';

interface AtomCounterTableProps {
  table: AtomBalanceRow[];
  isBalanced: boolean;
  reactants?: SubstanceParticipant[];
  products?: SubstanceParticipant[];
  reactantCoeffs?: number[];
  productCoeffs?: number[];
}

export const AtomCounterTable: React.FC<AtomCounterTableProps> = ({
  table,
  isBalanced,
  reactants,
  products,
  reactantCoeffs,
  productCoeffs
}) => {
  if (table.length === 0) return null;

  const totalReactantsMass = reactants?.reduce((sum, r, idx) => {
    const coeff = reactantCoeffs && reactantCoeffs[idx] !== undefined ? reactantCoeffs[idx] : (r.coefficient || 1);
    return sum + (r.parsed?.molarMass || 0) * coeff;
  }, 0);

  const totalProductsMass = products?.reduce((sum, p, idx) => {
    const coeff = productCoeffs && productCoeffs[idx] !== undefined ? productCoeffs[idx] : (p.coefficient || 1);
    return sum + (p.parsed?.molarMass || 0) * coeff;
  }, 0);

  return (
    <div className="atom-counter-card card">
      <div className="atom-counter-header">
        <div>
          <h3 className="atom-counter-title">Contagem e Conservação de Átomos</h3>
          <p className="atom-counter-subtitle">
            Verificação da Lei de Conservação da Massa (Lavoisier)
          </p>
        </div>
        <div className={`conservation-badge ${isBalanced ? 'balanced' : 'unbalanced'}`}>
          {isBalanced ? (
            <>
              <CheckCircle2 size={16} />
              <span>Balanceada</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} />
              <span>Desbalanceada</span>
            </>
          )}
        </div>
      </div>

      <div
        className="atom-table-container"
        role="region"
        aria-label="Tabela de contagem de átomos; use a rolagem horizontal para ver todas as colunas"
        tabIndex={0}
      >
        <table className="atom-table">
          <thead>
            <tr>
              <th>Elemento</th>
              <th className="text-center">Reagentes</th>
              <th className="text-center">Equilíbrio</th>
              <th className="text-center">Produtos</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {table.map(row => {
              const maxVal = Math.max(row.reactantsCount, row.productsCount, 1);
              const rPercent = (row.reactantsCount / maxVal) * 100;
              const pPercent = (row.productsCount / maxVal) * 100;

              return (
                <tr key={row.element} className={row.isBalanced ? 'row-balanced' : 'row-unbalanced'}>
                  <td className="element-cell">
                    <span className="element-symbol">{row.element}</span>
                    <span className="element-name">{row.name}</span>
                  </td>
                  <td className="count-cell text-center">
                    <span className="count-number">{row.reactantsCount}</span>
                    <div className="mini-bar-track">
                      <div className="mini-bar-fill reactants-fill" style={{ width: `${rPercent}%` }}></div>
                    </div>
                  </td>
                  <td className="status-cell text-center">
                    <span className={`diff-icon ${row.isBalanced ? 'icon-equal' : 'icon-unequal'}`}>
                      {row.isBalanced ? '=' : '≠'}
                    </span>
                  </td>
                  <td className="count-cell text-center">
                    <span className="count-number">{row.productsCount}</span>
                    <div className="mini-bar-track">
                      <div className="mini-bar-fill products-fill" style={{ width: `${pPercent}%` }}></div>
                    </div>
                  </td>
                  <td className="text-center">
                    {row.isBalanced ? (
                      <span className="badge badge-success">OK ({row.reactantsCount})</span>
                    ) : (
                      <span className="badge badge-warning">
                        {row.reactantsCount} vs {row.productsCount}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalReactantsMass !== undefined && totalProductsMass !== undefined && totalReactantsMass > 0 && (
        <div className="molar-mass-conservation-bar">
          <div className="mass-block">
            <Scale size={16} className="mass-icon" />
            <span className="mass-label">Massa dos Reagentes:</span>
            <span className="mass-value">{totalReactantsMass.toFixed(3)} g/mol</span>
          </div>
          <div className="mass-arrow">⇄</div>
          <div className="mass-block">
            <Scale size={16} className="mass-icon" />
            <span className="mass-label">Massa dos Produtos:</span>
            <span className="mass-value">{totalProductsMass.toFixed(3)} g/mol</span>
          </div>
          <div className="mass-conservation-result">
            {isBalanced ? (
              <span className="badge badge-success">
                Conservação de Massa Verificada (Lavoisier)
              </span>
            ) : (
              <span className="badge badge-warning">
                Diferença: {Math.abs(totalProductsMass - totalReactantsMass).toFixed(3)} g/mol
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
