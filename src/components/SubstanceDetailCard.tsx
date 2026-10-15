import React from 'react';
import { CatalogSubstance, ParsedFormula } from '../chemistry/types';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import './SubstanceDetailCard.css';

interface SubstanceDetailCardProps {
  formula: string;
  parsed?: ParsedFormula;
  catalogData?: CatalogSubstance;
  role?: 'Reagente' | 'Produto';
  coefficient?: number;
}

export const SubstanceDetailCard: React.FC<SubstanceDetailCardProps> = ({
  formula,
  parsed,
  catalogData,
  role,
  coefficient
}) => {
  const displayFormula = formatFormulaDisplay(formula);
  const preferredName = catalogData?.preferredName || formula;
  const molarMass = catalogData?.molarMass || parsed?.molarMass;
  const substanceType = catalogData?.substanceType || 'Substância identificada pelo parser';
  const description = catalogData?.description || 'Substância química válida com massa e composição calculadas a partir da tabela periódica dos elementos.';
  const commonNames = catalogData?.commonNames || [];
  const composition = catalogData?.composition || parsed?.elements || {};

  return (
    <article className="substance-detail-card">
      <div className="substance-card-top">
        <div className="substance-card-formula-box">
          {coefficient !== undefined && coefficient > 1 && (
            <span className="substance-card-coeff">{coefficient}</span>
          )}
          <span className="substance-card-formula">{displayFormula}</span>
        </div>
        {role && (
          <span className="substance-role">{role}</span>
        )}
      </div>

      <div className="substance-card-content">
        <h3 className="substance-card-title">{preferredName}</h3>

        {commonNames.length > 0 && (
          <p className="substance-common-names">
            <span>Também conhecido como:</span> {commonNames.join(', ')}
          </p>
        )}

        <div className="substance-meta-line">
          <span>{substanceType}</span>
          {molarMass && (
            <span>{molarMass.toFixed(2)} g/mol</span>
          )}
        </div>

        <p className="substance-description">{description}</p>

        <div className="substance-composition-box">
          <span className="composition-label">Átomos</span>
          <div className="composition-tags">
            {Object.entries(composition).map(([el, count]) => (
              <span key={el} className="composition-item">
                <strong>{el}</strong> {count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
