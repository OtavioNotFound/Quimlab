import React from 'react';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { findSubstanceInCatalog } from '../chemistry/substanceCatalog';
import './FormulaDisplay.css';

interface FormulaDisplayProps {
  formula: string;
  coefficient?: number;
  showTooltip?: boolean;
  className?: string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  formula,
  coefficient,
  showTooltip = true,
  className = ''
}) => {
  const formatted = formatFormulaDisplay(formula);
  const substance = showTooltip ? findSubstanceInCatalog(formula) : undefined;

  const isGas = formula.includes('(g)');
  const isPrecipitate = formula.includes('(s)');

  return (
    <span className={`formula-display-wrapper ${className}`}>
      <span className="formula-main-line">
        {coefficient !== undefined && coefficient > 1 && (
          <span className="formula-coefficient">{coefficient} </span>
        )}
        <span className="formula-text" title={substance ? `${substance.preferredName} (${substance.substanceType})` : undefined}>
          {formatted}
        </span>
        {isGas && <span className="state-arrow-indicator gas" title="Desprendimento de gás">↑</span>}
        {isPrecipitate && <span className="state-arrow-indicator precipitate" title="Precipitação sólida">↓</span>}
      </span>
      {substance && showTooltip && (
        <span className="formula-inline-name">{substance.preferredName}</span>
      )}
    </span>
  );
};
