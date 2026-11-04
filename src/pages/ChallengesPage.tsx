import React, { useEffect, useRef, useState } from 'react';
import { balanceEquation, parseEquation } from '../chemistry';
import { PRESET_REACTIONS } from '../chemistry/presetReactions';
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
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

const INFINITE_CHALLENGES = buildInfiniteChallenges();

function buildInfiniteChallenges(): ChallengeItem[] {
  const knownEquations = new Set(CHALLENGES.map(item => item.equation.replace(/\s+/g, '').toLowerCase()));
  const additions = PRESET_REACTIONS.flatMap((preset, index) => {
    const equation = preset.unbalanced.replace(/\s+/g, '').toLowerCase();
    if (knownEquations.has(equation)) return [];

    const parsed = parseEquation(preset.unbalanced);
    const balanced = balanceEquation(parsed);
    const coefficients = [...(balanced.reactantsCoefficients ?? []), ...(balanced.productsCoefficients ?? [])];
    if (!parsed.isValid || !balanced.success || coefficients.every(value => value === 1)) return [];

    knownEquations.add(equation);
    const level = preset.id === 'cellular-respiration' ? 'Avançado'
      : ['synthesis-salt', 'decomp-peroxide'].includes(preset.id) ? 'Iniciante' : 'Intermediário';
    return [{
      id: CHALLENGES.length + index + 1,
      equation: preset.unbalanced,
      level,
      tip: preset.didacticTips,
      explanation: preset.description
    } satisfies ChallengeItem];
  });

  return [...CHALLENGES, ...additions];
}

const STARTING_TIME = 45;
const MAX_TIME = 60;
const TIME_BONUS = 2;
const WRONG_ANSWER_PENALTY = 5;

export const ChallengesPage: React.FC = () => {
  const [mode, setMode] = useState<'classic' | 'infinite'>('classic');
  const [infiniteStatus, setInfiniteStatus] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [infiniteScore, setInfiniteScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(() => new Set());
  const [showTip, setShowTip] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'already-scored' | 'error' | null>(null);
  const nextChallengeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const challengePool = mode === 'infinite' ? INFINITE_CHALLENGES : CHALLENGES;
  const challenge = challengePool[currentIndex];
  const parsed = parseEquation(challenge.equation);
  const balancedTarget = balanceEquation(parsed);

  const [coeffs, setCoeffs] = useState<{ reactants: number[]; products: number[] }>(() => ({
    reactants: parsed.reactants.map(() => 1),
    products: parsed.products.map(() => 1)
  }));

  useEffect(() => {
    if (mode !== 'infinite' || infiniteStatus !== 'playing') return;
    const timer = window.setInterval(() => setTimeLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [mode, infiniteStatus]);

  useEffect(() => {
    if (mode === 'infinite' && infiniteStatus === 'playing' && timeLeft === 0) {
      setInfiniteStatus('finished');
      if (nextChallengeTimer.current) window.clearTimeout(nextChallengeTimer.current);
    }
  }, [infiniteStatus, mode, timeLeft]);

  const resetCoefficients = (index: number, pool = challengePool) => {
    const next = parseEquation(pool[index].equation);
    setCoeffs({ reactants: next.reactants.map(() => 1), products: next.products.map(() => 1) });
    setShowTip(false);
    setFeedback(null);
  };

  const startInfinite = () => {
    if (nextChallengeTimer.current) window.clearTimeout(nextChallengeTimer.current);
    setCurrentIndex(0);
    resetCoefficients(0);
    setInfiniteScore(0);
    setTimeLeft(STARTING_TIME);
    setStreak(0);
    setBestStreak(0);
    setRound(1);
    setInfiniteStatus('playing');
  };

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
      if (mode === 'infinite') {
        if (infiniteStatus !== 'playing' || feedback === 'success') return;
        setFeedback('success');
        setInfiniteScore(total => total + 10 + Math.min(streak, 5));
        setStreak(value => value + 1);
        setBestStreak(value => Math.max(value, streak + 1));
        setTimeLeft(value => Math.min(MAX_TIME, value + TIME_BONUS));

        nextChallengeTimer.current = window.setTimeout(() => {
          const nextRound = round + 1;
          const maxLevel = nextRound < 4 ? 0 : nextRound < 9 ? 1 : 2;
          const candidates = challengePool.filter(item => ['Iniciante', 'Intermediário', 'Avançado'].indexOf(item.level) <= maxLevel);
          const withoutRepeat = candidates.filter(item => item.id !== challenge.id);
          const pool = withoutRepeat.length ? withoutRepeat : candidates;
          const next = pool[Math.floor(Math.random() * pool.length)];
          const nextIndex = challengePool.findIndex(item => item.id === next.id);
          setCurrentIndex(nextIndex);
          resetCoefficients(nextIndex);
          setRound(nextRound);
        }, 650);
        return;
      }

      const alreadyCompleted = completedChallenges.has(challenge.id);
      setFeedback(alreadyCompleted ? 'already-scored' : 'success');

      if (!alreadyCompleted) {
        setCompletedChallenges(prev => new Set(prev).add(challenge.id));
        setScore(total => total + 10);
      }
    } else {
      if (mode === 'infinite' && infiniteStatus === 'playing') {
        setStreak(0);
        setTimeLeft(value => Math.max(0, value - WRONG_ANSWER_PENALTY));
      }
      setFeedback('error');
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % CHALLENGES.length;
    setCurrentIndex(nextIdx);
    resetCoefficients(nextIdx);
  };

  return (
    <div className="challenges-page container">
      <header className="folio-header">
        <div>
          <h1 className="challenges-title">Desafios de balanceamento</h1>
        </div>
        <div className="challenges-aside">
          <p className="challenges-subtitle">
            Ajuste os coeficientes até a contagem de átomos fechar nos dois lados.
          </p>
          {mode === 'classic' && <p className="challenge-score">
            <span>Pontuação desta sessão</span><strong>{score}</strong>
          </p>}
        </div>
      </header>

      <div className="challenge-mode-switch" role="group" aria-label="Modo do desafio">
        <button type="button" className={mode === 'classic' ? 'active' : ''} aria-pressed={mode === 'classic'} onClick={() => {
          if (nextChallengeTimer.current) window.clearTimeout(nextChallengeTimer.current);
          setMode('classic'); setInfiniteStatus('ready'); setCurrentIndex(0); resetCoefficients(0, CHALLENGES);
        }}>Clássico</button>
        <button type="button" className={mode === 'infinite' ? 'active' : ''} aria-pressed={mode === 'infinite'} onClick={() => {
          if (nextChallengeTimer.current) window.clearTimeout(nextChallengeTimer.current);
          setMode('infinite'); setInfiniteStatus('ready');
        }}>Infinito</button>
      </div>

      {mode === 'infinite' && infiniteStatus === 'ready' && <section className="challenge-sheet infinite-intro">
        <span className="challenge-context">45 segundos iniciais · até 60</span>
        <h2>Quantas reações você consegue equilibrar?</h2>
        <p>Acertos dão 2 segundos e aumentam seu combo. Erros tiram 5 segundos; a dificuldade cresce conforme você avança.</p>
        <button type="button" className="btn btn-primary" onClick={startInfinite}>Começar</button>
      </section>}

      {mode === 'infinite' && infiniteStatus === 'finished' && <section className="challenge-sheet infinite-finished" aria-live="polite">
        <span className="challenge-context">Fim de jogo · {round - 1} reações</span>
        <h2>{infiniteScore} pontos</h2>
        <p>Maior combo: {bestStreak} acertos.</p>
        <button type="button" className="btn btn-primary" onClick={startInfinite}>Jogar de novo</button>
      </section>}

      {(mode === 'classic' || infiniteStatus === 'playing') && <div className={`challenge-sheet ${mode === 'infinite' ? 'infinite-live' : ''}`}>
        <div className="challenge-card-header">
          <div className="challenge-meta">
            {mode === 'classic' ? <span className="challenge-step">Desafio {currentIndex + 1} de {CHALLENGES.length}</span> : <>
              <span className="challenge-step">Rodada {round}</span><span className="infinite-score">{infiniteScore} pts</span><span className="infinite-streak">Combo ×{streak}</span>
            </>}
            <span className="challenge-level">
              {challenge.level}
            </span>
          </div>
          {mode === 'classic' && <button onClick={() => setShowTip(!showTip)} className="btn btn-secondary tip-btn">
            <Lightbulb size={16} />
            <span>{showTip ? 'Ocultar Dica' : 'Pedir Dica'}</span>
          </button>}
        </div>

        {mode === 'infinite' && <div className="infinite-clock" aria-label={`${timeLeft} segundos restantes`}>
          <div className="infinite-clock-label"><span>Tempo</span><strong>{`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}</strong></div> {/* taste-skill-ignore: formato de relógio */}
          <div className="infinite-clock-track"><span style={{ transform: `scaleX(${timeLeft / MAX_TIME})` }} /></div>
        </div>}

        {showTip && (
          <div className="tip-alert-box">
            <p><strong>Dica:</strong> {challenge.tip}</p>
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

        {feedback === 'already-scored' && (
          <div className="feedback-banner success">
            <CheckCircle2 size={20} />
            <div>
              <strong>Resposta correta.</strong>
              <p>Este desafio já pontuou nesta sessão; conferir novamente não altera sua pontuação.</p>
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
          <button onClick={handleVerify} className="btn btn-primary" disabled={mode === 'infinite' && (infiniteStatus !== 'playing' || feedback === 'success')}>
            <CheckCircle2 size={18} />
            <span>Verificar Resposta</span>
          </button>

          {mode === 'classic' && <button onClick={handleNext} className="btn btn-secondary">
            <span>Próximo Desafio</span>
            <ArrowRight size={18} />
          </button>}
        </div>
      </div>}
    </div>
  );
};
