import React, { useState } from 'react';
import { balanceEquation, parseEquation } from '../chemistry';
import { Award, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import './ChallengesPage.css';

interface ChallengeItem {
  id: number;
  equation: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  tip: string;
  explanation: string;
}

const CHALLENGES: ChallengeItem[] = [
  {
    id: 1,
    equation: 'H2 + O2 -> H2O',
    level: 'Iniciante',
    tip: 'Observe que o oxigênio tem 2 átomos nos reagentes (O₂) e apenas 1 na água (H₂O). Comece dobrando a água.',
    explanation: '2 H₂ + O₂ → 2 H₂O. Com 2 H₂O temos 4 hidrogênios, exigindo 2 H₂ nos reagentes.'
  },
  {
    id: 2,
    equation: 'Fe + O2 -> Fe2O3',
    level: 'Iniciante',
    tip: 'O oxigênio tem índice 2 nos reagentes e 3 no produto. Encontre o mínimo múltiplo comum (6 átomos de O).',
    explanation: '4 Fe + 3 O₂ → 2 Fe₂O₃. 3×2 = 6 oxigênios e 2×2 = 4 ferros.'
  },
  {
    id: 3,
    equation: 'CH4 + O2 -> CO2 + H2O',
    level: 'Intermediário',
    tip: 'Balanceie primeiro o carbono (1:1), depois o hidrogênio (4 nos reagentes -> 2 H₂O) e por fim o oxigênio.',
    explanation: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O. Total de 4 oxigênios de cada lado.'
  },
  {
    id: 4,
    equation: 'Zn + HCl -> ZnCl2 + H2',
    level: 'Intermediário',
    tip: 'Veja que o cloreto de zinco (ZnCl₂) necessita de 2 cloros. Basta ajustar o coeficiente do ácido clorídrico.',
    explanation: 'Zn + 2 HCl → ZnCl₂ + H₂. Zinco e hidrogênio ficam perfeitamente equilibrados.'
  },
  {
    id: 5,
    equation: 'Al2(SO4)3 + Ca(OH)2 -> Al(OH)3 + CaSO4',
    level: 'Avançado',
    tip: 'Trate os radicais poliatômicos sulfato (SO₄) e hidróxido (OH) como blocos unidos ao balancear.',
    explanation: 'Al₂(SO₄)₃ + 3 Ca(OH)₂ → 2 Al(OH)₃ + 3 CaSO₄. 2 Al, 3 Ca, 3 SO₄ e 6 OH de cada lado.'
  },
  {
    id: 6,
    equation: 'C2H5OH + O2 -> CO2 + H2O',
    level: 'Avançado',
    tip: 'Cuidado: não se esqueça de contar o átomo de oxigênio que já existe no etanol C₂H₅OH!',
    explanation: 'C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O. 2 carbonos, 6 hidrogênios e 7 oxigênios de cada lado.'
  }
];

export const ChallengesPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

  const challenge = CHALLENGES[currentIndex];
  const parsed = parseEquation(challenge.equation);
  const balancedTarget = balanceEquation(parsed);

  const [coeffs, setCoeffs] = useState<{ reactants: number[]; products: number[] }>(() => ({
    reactants: parsed.reactants.map(() => 1),
    products: parsed.products.map(() => 1)
  }));

  const handleCoeffChange = (side: 'reactants' | 'products', idx: number, delta: number) => {
    setCoeffs(prev => {
      const arr = [...prev[side]];
      arr[idx] = Math.max(1, arr[idx] + delta);
      return { ...prev, [side]: arr };
    });
    setFeedback(null);
  };

  const handleVerify = () => {
    if (!balancedTarget.success) return;
    const rExpected = balancedTarget.reactantsCoefficients || [];
    const pExpected = balancedTarget.productsCoefficients || [];

    const isCorrect =
      rExpected.every((v, i) => v === coeffs.reactants[i]) &&
      pExpected.every((v, i) => v === coeffs.products[i]);

    if (isCorrect) {
      setFeedback('success');
      setScore(s => s + 10);
    } else {
      setFeedback('error');
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % CHALLENGES.length;
    setCurrentIndex(nextIdx);
    const nextChallenge = CHALLENGES[nextIdx];
    const nextParsed = parseEquation(nextChallenge.equation);
    setCoeffs({
      reactants: nextParsed.reactants.map(() => 1),
      products: nextParsed.products.map(() => 1)
    });
    setShowTip(false);
    setFeedback(null);
  };

  return (
    <div className="challenges-page container">
      <div className="challenges-hero">
        <div className="badge badge-warning">
          <Award size={14} />
          <span>Exercícios Interativos</span>
        </div>
        <h1 className="challenges-title">Desafios de Balanceamento Químico</h1>
        <p className="challenges-subtitle">
          Treine o raciocínio estequiométrico ajustando os coeficientes inteiros e domine a Lei de Conservação da Massa.
        </p>

        <div className="score-badge-card">
          <span>Pontuação Total:</span>
          <strong>{score} pts</strong>
        </div>
      </div>

      <div className="challenge-card card">
        <div className="challenge-card-header">
          <div className="challenge-meta">
            <span className="challenge-step">Desafio {currentIndex + 1} de {CHALLENGES.length}</span>
            <span className={`badge ${challenge.level === 'Iniciante' ? 'badge-success' : challenge.level === 'Intermediário' ? 'badge-primary' : 'badge-purple'}`}>
              Nível {challenge.level}
            </span>
          </div>
          <button onClick={() => setShowTip(!showTip)} className="btn btn-secondary tip-btn">
            <Lightbulb size={16} />
            <span>{showTip ? 'Ocultar Dica' : 'Pedir Dica'}</span>
          </button>
        </div>

        {showTip && (
          <div className="tip-alert-box">
            <p>💡 <strong>Dica do Professor:</strong> {challenge.tip}</p>
          </div>
        )}

        {/* Área Interativa de Balanceamento */}
        <div className="interactive-challenge-equation">
          <div className="challenge-side">
            {parsed.reactants.map((r, i) => (
              <div key={i} className="participant-stepper-item">
                <div className="stepper-box">
                  <button onClick={() => handleCoeffChange('reactants', i, -1)} className="step-btn">-</button>
                  <span className="step-num">{coeffs.reactants[i]}</span>
                  <button onClick={() => handleCoeffChange('reactants', i, 1)} className="step-btn">+</button>
                </div>
                <span className="step-formula">{r.formula}</span>
                {i < parsed.reactants.length - 1 && <span className="step-plus">+</span>}
              </div>
            ))}
          </div>

          <div className="arrow-box">→</div>

          <div className="challenge-side">
            {parsed.products.map((p, j) => (
              <div key={j} className="participant-stepper-item">
                <div className="stepper-box">
                  <button onClick={() => handleCoeffChange('products', j, -1)} className="step-btn">-</button>
                  <span className="step-num">{coeffs.products[j]}</span>
                  <button onClick={() => handleCoeffChange('products', j, 1)} className="step-btn">+</button>
                </div>
                <span className="step-formula">{p.formula}</span>
                {j < parsed.products.length - 1 && <span className="step-plus">+</span>}
              </div>
            ))}
          </div>
        </div>

        {feedback === 'success' && (
          <div className="feedback-banner success">
            <CheckCircle2 size={20} />
            <div>
              <strong>Excelente! Equação balanceada com perfeição! (+10 pts)</strong>
              <p>{challenge.explanation}</p>
            </div>
          </div>
        )}

        {feedback === 'error' && (
          <div className="feedback-banner error">
            <AlertTriangle size={20} />
            <div>
              <strong>Ainda não está correto.</strong>
              <p>Confira o número total de átomos de cada elemento nos dois lados da equação e tente novamente.</p>
            </div>
          </div>
        )}

        <div className="challenge-actions-bar">
          <button onClick={handleVerify} className="btn btn-primary">
            <CheckCircle2 size={18} />
            <span>Verificar Resposta</span>
          </button>

          <button onClick={handleNext} className="btn btn-secondary">
            <span>Próximo Desafio</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
