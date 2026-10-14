import React from 'react';
import { CatalogSubstance, ParsedFormula } from '../chemistry/types';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { Atom, Scale, Tag } from 'lucide-react';
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
    <div className="substance-detail-card card">
      <div className="substance-card-top">
        <div className="substance-card-formula-box">
          {coefficient !== undefined && coefficient > 1 && (
            <span className="substance-card-coeff">{coefficient}</span>
          )}
          <span className="substance-card-formula">{displayFormula}</span>
        </div>
        {role && (
          <span className={`badge ${role === 'Reagente' ? 'badge-primary' : 'badge-cyan'}`}>
            {role}
          </span>
        )}
      </div>

      <div className="substance-card-content">
        <h4 className="substance-card-title">{preferredName}</h4>

        {commonNames.length > 0 && (
          <p className="substance-common-names">
            <Tag size={13} className="inline-icon" />
            <span>Usual: {commonNames.join(', ')}</span>
          </p>
        )}

        <div className="substance-badges-row">
          <span className="badge badge-purple">{substanceType}</span>
          {molarMass && (
            <span className="badge badge-primary">
              <Scale size={13} />
              {molarMass.toFixed(2)} g/mol
            </span>
          )}
        </div>

        <p className="substance-description">{description}</p>

        <div className="substance-composition-box">
          <span className="composition-label">
            <Atom size={14} /> Composição atômica:
          </span>
          <div className="composition-tags">
            {Object.entries(composition).map(([el, count]) => (
              <span key={el} className="elem-pill">
                <strong>{el}:</strong> {count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
