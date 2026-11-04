import { useState } from 'react';
import type { SubstanceParticipant } from '../chemistry/types';
import { getElement } from '../chemistry/periodicTable';
import { formatFormulaDisplay } from '../chemistry/formulaParser';
import { ArrowRight, Equal, MoveRight, Pause, Play } from 'lucide-react';
import { CPK_COLORS, MolecularUnit } from './MolecularViewer';
import './ReactionParticles.css';

interface Props {
  reactants: SubstanceParticipant[];
  products: SubstanceParticipant[];
  originalReactants: SubstanceParticipant[];
  originalProducts: SubstanceParticipant[];
}

/** Shows known molecular structures with bonds; unknown formulas remain composition-only. */
function ParticleGroup({ participant, highlighted }: { participant: SubstanceParticipant; highlighted: string | null }) {
  const elements = Object.entries(participant.parsed.elements);
  const total = elements.reduce((sum, [, count]) => sum + count, 0);
  return (
    <div className="particle-compound">
      <MolecularUnit formula={participant.parsed.cleanFormula} title={participant.formula} elements={participant.parsed.elements} animated highlighted={highlighted} />
      <div className="particle-formula"><span>{participant.coefficient} ×</span> {formatFormulaDisplay(participant.formula)}</div>
      {total > 12 && <small>{total} átomos por unidade</small>}
    </div>
  );
}

function countAtoms(participants: SubstanceParticipant[]) {
  const totals: Record<string, number> = {};
  for (const participant of participants) {
    for (const [element, count] of Object.entries(participant.parsed.elements)) {
      totals[element] = (totals[element] ?? 0) + count * participant.coefficient;
    }
  }
  return totals;
}

export function ReactionParticles({ reactants, products, originalReactants, originalProducts }: Props) {
  const [view, setView] = useState<'result' | 'input'>('result');
  const [paused, setPaused] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const left = view === 'result' ? reactants : originalReactants;
  const right = view === 'result' ? products : originalProducts;
  const leftAtoms = countAtoms(left);
  const rightAtoms = countAtoms(right);
  const elements = [...new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)])];
  const activeElement = highlighted && elements.includes(highlighted) ? highlighted : null;
  const conserved = elements.every(element => leftAtoms[element] === rightAtoms[element]);

  return (
    <section id="reaction-visual" className="reaction-particles" data-paused={paused} aria-label="Composição da reação">
      <div className="particle-toolbar">
        <h3>Átomos</h3>
        <div className="particle-view-switch" aria-label="Comparar proporções">
          <button type="button" aria-pressed={view === 'input'} onClick={() => setView('input')}>Entrada</button>
          <button type="button" aria-pressed={view === 'result'} onClick={() => setView('result')}>Resultado</button>
        </div>
      <div className="particle-motion-bar">
        <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Retomar movimento dos átomos' : 'Pausar movimento dos átomos'}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? 'Retomar' : 'Pausar'}
        </button>
      </div>
      </div>
      <div className="particle-stage">
        <div className="particle-side">
          <span className="particle-side-label">Reagentes</span>
          <div className="particle-compounds">{left.map((participant, index) => <ParticleGroup key={`${participant.formula}-${index}`} participant={participant} highlighted={activeElement} />)}</div>
        </div>
        <ArrowRight className="particle-arrow" size={24} aria-hidden="true" />
        <div className="particle-side">
          <span className="particle-side-label">Produtos</span>
          <div className="particle-compounds">{right.map((participant, index) => <ParticleGroup key={`${participant.formula}-${index}`} participant={participant} highlighted={activeElement} />)}</div>
        </div>
      </div>

      <div className="particle-conservation" aria-live="polite">
        <div className="particle-conservation-heading">
          <h3>Contagem</h3>
          <span className={conserved ? 'atoms-conserved' : 'atoms-unbalanced'}>{conserved ? 'Conservado' : 'Não conservado'}</span>
        </div>
        <div className="atom-comparisons">
          {elements.map(element => {
            const before = leftAtoms[element] ?? 0;
            const after = rightAtoms[element] ?? 0;
            const max = Math.max(before, after, 1);
            const color = CPK_COLORS[element] || CPK_COLORS.default;
            return (
              <div className="atom-comparison" key={element}>
                <button type="button" className="comparison-identity" aria-pressed={activeElement === element} aria-label={`Destacar ${getElement(element)?.name ?? element}`} onClick={() => setHighlighted(activeElement === element ? null : element)}><span className="element-dot" style={{ background: color.bg, borderColor: color.border }} /><span>{getElement(element)?.name ?? element}</span></button>
                <div className="comparison-figures"><strong>{before}</strong>{before === after ? <Equal size={14} aria-label="igual a" /> : <MoveRight size={14} aria-label="para" />}<strong>{after}</strong></div>
                <div className="comparison-bars" aria-hidden="true">
                  <span style={{ width: `${before / max * 100}%` }} />
                  <span style={{ width: `${after / max * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
      <details className="lab-help particle-guide"><summary>Sobre o modelo</summary>
      <p className="particle-caption">Estruturas conhecidas mostram ligações; fórmulas sem estrutura definida mostram apenas a composição.</p>
        <p className="comparison-key">Átomos nos reagentes / produtos. Toque no elemento para destacá-lo.</p>
      </details>
    </section>
  );
}
