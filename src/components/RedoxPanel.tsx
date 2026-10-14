import React, { useMemo } from 'react';
import { ParsedEquation } from '../chemistry/types';
import { analyzeRedox } from '../chemistry/oxidationStates';
import { Zap, ArrowUpRight, ArrowDownRight, Minus, ShieldCheck } from 'lucide-react';
import './RedoxPanel.css';

interface RedoxPanelProps {
  equation: ParsedEquation;
}

export const RedoxPanel: React.FC<RedoxPanelProps> = ({ equation }) => {
  const redoxResult = useMemo(() => {
    return analyzeRedox(equation);
  }, [equation]);

  return (
    <div className="redox-panel-card card">
      <div className="redox-header">
        <div className="redox-title-box">
          <Zap size={22} className="redox-icon" />
          <div>
            <h3 className="redox-title">Estados de Oxidação (Nox) & Análise Redox</h3>
            <p className="redox-subtitle">
              Acompanhamento de transferência de elétrons, semi-reações e agentes oxidante e redutor.
            </p>
          </div>
        </div>

        <div className={`redox-status-badge ${redoxResult.isRedox ? 'is-redox' : 'not-redox'}`}>
          {redoxResult.isRedox ? (
            <>
              <Zap size={15} />
              <span>Reação de Oxirredução (Redox)</span>
            </>
          ) : (
            <>
              <ShieldCheck size={15} />
              <span>Sem Transferência de Elétrons</span>
            </>
          )}
        </div>
      </div>

      {/* Tabela de Variação de Nox por Elemento */}
      <div className="nox-table-container">
        <table className="nox-table">
          <thead>
            <tr>
              <th>Elemento</th>
              <th className="text-center">Nox Reagente</th>
              <th className="text-center">Variação (Δ)</th>
              <th className="text-center">Nox Produto</th>
              <th className="text-center">Comportamento Eletrônico</th>
            </tr>
          </thead>
          <tbody>
            {redoxResult.elementStates.map(item => {
              const delta = item.electronsDelta;
              const isOx = item.role === 'oxidized';
              const isRed = item.role === 'reduced';

              return (
                <tr key={item.element} className={isOx ? 'row-ox' : isRed ? 'row-red' : ''}>
                  <td className="element-cell">
                    <span className="element-symbol-pill">{item.element}</span>
                    <span className="element-full-name">{item.name}</span>
                  </td>

                  <td className="text-center font-mono font-bold">
                    {item.reactantNox > 0 ? `+${item.reactantNox}` : item.reactantNox}
                  </td>

                  <td className="text-center">
                    <div className="delta-box">
                      {isOx && <ArrowUpRight size={16} className="ox-arrow" />}
                      {isRed && <ArrowDownRight size={16} className="red-arrow" />}
                      {!isOx && !isRed && <Minus size={16} className="unchanged-icon" />}
                      <span className="delta-val font-mono">
                        {delta > 0 ? `+${delta}` : delta === 0 ? '0' : `${delta}`}
                      </span>
                    </div>
                  </td>

                  <td className="text-center font-mono font-bold">
                    {item.productNox > 0 ? `+${item.productNox}` : item.productNox}
                  </td>

                  <td className="text-center">
                    {isOx && (
                      <span className="badge badge-warning" title="Perda de elétrons">
                        Oxidou (Perdeu {Math.abs(delta)} e⁻)
                      </span>
                    )}
                    {isRed && (
                      <span className="badge badge-cyan" title="Ganho de elétrons">
                        Reduziu (Ganhou {Math.abs(delta)} e⁻)
                      </span>
                    )}
                    {!isOx && !isRed && (
                      <span className="badge badge-secondary">
                        Inalterado
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explicação Didática dos Agentes */}
      <div className="redox-agents-summary">
        {redoxResult.isRedox ? (
          <div className="agents-cards-grid">
            <div className="agent-card ox-card">
              <span className="agent-role-title">Agente Redutor (Provocou a redução do outro)</span>
              <span className="agent-formula font-mono">{redoxResult.reducingAgent}</span>
              <p className="agent-desc">
                Contém o elemento <strong>{redoxResult.oxidizedElement}</strong>, que doou elétrons e teve seu Nox aumentado.
              </p>
            </div>

            <div className="agent-card red-card">
              <span className="agent-role-title">Agente Oxidante (Provocou a oxidação do outro)</span>
              <span className="agent-formula font-mono">{redoxResult.oxidizingAgent}</span>
              <p className="agent-desc">
                Contém o elemento <strong>{redoxResult.reducedElement}</strong>, que recebeu elétrons e teve seu Nox reduzido.
              </p>
            </div>
          </div>
        ) : (
          <p className="redox-explanation-text">{redoxResult.explanation}</p>
        )}
      </div>
    </div>
  );
};
