import React, { useState, useMemo } from 'react';
import { ParsedEquation } from '../chemistry/types';
import { calculateStoichiometry, calculateMassPercentages } from '../chemistry/stoichiometry';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { AlertCircle, PieChart, RefreshCw } from 'lucide-react';
import './StoichiometryCalculator.css';

interface StoichiometryCalculatorProps {
  equation: ParsedEquation;
  isBalanced: boolean;
}

export const StoichiometryCalculator: React.FC<StoichiometryCalculatorProps> = ({
  equation,
  isBalanced
}) => {
  // Guarda os inputs de cada reagente
  const [inputs, setInputs] = useState<{ [reactantIdx: number]: { value: string; unit: 'g' | 'mol' } }>({});
  const [selectedSubstanceIdx, setSelectedSubstanceIdx] = useState<number | null>(null);

  const handleInputChange = (idx: number, val: string) => {
    setInputs(prev => ({
      ...prev,
      [idx]: {
        value: val,
        unit: prev[idx]?.unit || 'g'
      }
    }));
  };

  const handleUnitToggle = (idx: number) => {
    setInputs(prev => ({
      ...prev,
      [idx]: {
        value: prev[idx]?.value || '',
        unit: prev[idx]?.unit === 'mol' ? 'g' : 'mol'
      }
    }));
  };

  const handleClearInputs = () => {
    setInputs({});
  };

  const numericInputs = useMemo(() => {
    const res: { [idx: number]: { value: number; unit: 'g' | 'mol' } } = {};
    for (const [k, v] of Object.entries(inputs)) {
      const num = parseFloat(v.value.replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        res[Number(k)] = { value: num, unit: v.unit };
      }
    }
    return res;
  }, [inputs]);

  const stoichResult = useMemo(() => {
    return calculateStoichiometry(equation, numericInputs);
  }, [equation, numericInputs]);

  if (!isBalanced) {
    return (
      <section className="stoich-card">
        <div className="stoich-unbalanced-alert">
          <AlertCircle size={22} className="alert-icon" />
          <div>
            <h4>Equação Não Balanceada</h4>
            <p>
              Os cálculos estequiométricos exigem que a equação respeite a Lei de Lavoisier.
              Clique no botão <strong>"Balancear Automaticamente"</strong> no laboratório para habilitar a calculadora.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Composição percentual da substância selecionada
  const selectedParticipant = selectedSubstanceIdx !== null
    ? (selectedSubstanceIdx < equation.reactants.length
        ? equation.reactants[selectedSubstanceIdx]
        : equation.products[selectedSubstanceIdx - equation.reactants.length])
    : null;

  const massBreakdown = selectedParticipant
    ? calculateMassPercentages(selectedParticipant.parsed)
    : null;

  return (
    <section className="stoich-card">
      <div className="stoich-header">
        <div className="stoich-title-box">
          <div>
            <h3 className="stoich-title">Estequiometria</h3>
            <p className="stoich-subtitle">
              Informe massa (g) ou quantidade (mol) de um reagente para estimar consumo, reagente limitante e produtos.
            </p>
          </div>
        </div>

        <button onClick={handleClearInputs} className="btn btn-secondary btn-sm" title="Redefinir valores">
          <RefreshCw size={14} />
          <span>Redefinir</span>
        </button>
      </div>

      {/* Tabela de Cálculo de Participantes */}
      <div className="stoich-table-container">
        <table className="stoich-table">
          <thead>
            <tr>
              <th>Substância</th>
              <th>Papel</th>
              <th className="text-center">Proporção</th>
              <th className="text-center">Massa Molar</th>
              <th>Sua Quantidade (Entrada)</th>
              <th className="text-center">Quantidade Calculada</th>
              <th className="text-center">Massa Total</th>
              <th className="text-center">Status Estequiométrico</th>
            </tr>
          </thead>
          <tbody>
            {stoichResult.items.map((item, idx) => {
              const isReactant = item.role === 'reactant';
              const rIdx = idx; // Índice relativo aos reagentes

              return (
                <tr
                  key={idx}
                  className={`stoich-row ${item.isLimiting ? 'row-limiting' : ''} ${item.isExcess ? 'row-excess' : ''}`}
                >
                  <td className="substance-name-cell">
                    <span className="substance-formula-txt">{formatFormulaDisplay(item.formula)}</span>
                    <span className="substance-desc-txt">{item.name}</span>
                    <button
                      onClick={() => setSelectedSubstanceIdx(idx)}
                      className="percent-btn"
                      title="Ver composição centesimal (% em massa)"
                    >
                      <PieChart size={13} />
                      <span>% Massa</span>
                    </button>
                  </td>

                  <td>
                    <span className={`badge ${isReactant ? 'badge-primary' : 'badge-cyan'}`}>
                      {isReactant ? 'Reagente' : 'Produto'}
                    </span>
                  </td>

                  <td className="text-center font-mono font-bold">
                    {item.coefficient} mol
                  </td>

                  <td className="text-center font-mono">
                    {item.molarMass} g/mol
                  </td>

                  {/* Campo de Entrada (habilitado nos reagentes) */}
                  <td>
                    {isReactant ? (
                      <div className="stoich-input-group">
                        <input
                          type="text"
                          placeholder="Ex: 50"
                          value={inputs[rIdx]?.value || ''}
                          onChange={e => handleInputChange(rIdx, e.target.value)}
                          className="stoich-number-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleUnitToggle(rIdx)}
                          className="unit-toggle-btn"
                          title="Alternar entre gramas (g) e mols"
                        >
                          {inputs[rIdx]?.unit || 'g'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted text-sm italic">Calculado automaticamente</span>
                    )}
                  </td>

                  <td className="text-center font-mono font-bold text-accent">
                    {item.moles} mol
                  </td>

                  <td className="text-center font-mono font-bold">
                    {item.massGrams} g
                  </td>

                  <td className="text-center">
                    {item.isLimiting && (
                      <span className="badge badge-warning" title="Esgota primeiro e dita o rendimento máximo">
                        Reagente Limitante
                      </span>
                    )}
                    {item.isExcess && (
                      <span className="badge badge-cyan" title={`Sobra ${item.excessRemainingGrams}g sem reagir`}>
                        Excesso (+{item.excessRemainingGrams}g)
                      </span>
                    )}
                    {!item.isLimiting && !item.isExcess && (
                      <span className="badge badge-success">Proporção Exata</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explicação da Estequiometria */}
      <div className="stoich-explanation-box">
        <p className="explanation-text">{stoichResult.explanation}</p>
      </div>

      {/* Modal/Gaveta de Composição Centesimal (% em Massa) */}
      {selectedParticipant && massBreakdown && (
        <div className="composition-breakdown-card">
          <div className="breakdown-header">
            <h4>
              Composição Centesimal em Massa de <strong>{formatFormulaDisplay(selectedParticipant.formula)}</strong> ({selectedParticipant.parsed.molarMass.toFixed(3)} g/mol)
            </h4>
            <button onClick={() => setSelectedSubstanceIdx(null)} className="close-link">
              Fechar
            </button>
          </div>

          <div className="breakdown-bars-grid">
            {massBreakdown.map(item => (
              <div key={item.element} className="breakdown-item">
                <div className="breakdown-labels">
                  <span className="el-badge">
                    <strong>{item.element}</strong> ({item.name}): {item.count} átomo(s)
                  </span>
                  <span className="el-percent font-mono font-bold">{item.percentage}%</span>
                </div>
                <div className="breakdown-track">
                  <div className="breakdown-fill" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="mass-contrib font-mono text-xs text-muted">
                  Contribuição: {item.totalMass} g/mol ({item.atomicMass} × {item.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
