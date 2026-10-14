import { parseEquation } from './equationParser';
import { PRESET_REACTIONS } from './presetReactions';
import { SubstanceParticipant } from './types';

export interface ProductPrediction {
  equation: string;
  source: 'preset' | 'combustion-rule';
}

const ARROW_PATTERN = /<=>|<->|⇌|-->|->|==>|=>|→|=/g;

/** Predicts products only for known examples and a basic complete-combustion rule. */
export function predictReactionProducts(input: string): ProductPrediction | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const arrows = [...trimmed.matchAll(ARROW_PATTERN)];
  const lastArrow = arrows.at(-1);
  const hasIncompleteArrow = lastArrow && lastArrow.index! + lastArrow[0].length === trimmed.length;

  if (arrows.length > 0 && !hasIncompleteArrow) return null;

  const reactantSide = hasIncompleteArrow
    ? trimmed.slice(0, lastArrow.index).trim()
    : trimmed;
  const parsedInput = parseEquation(`${reactantSide} -> H2O`);
  if (!parsedInput.isValid) return null;

  const reactantKey = getFormulaKey(parsedInput.reactants);

  for (const preset of PRESET_REACTIONS) {
    const parsedPreset = parseEquation(preset.unbalanced);
    if (!parsedPreset.isValid || getFormulaKey(parsedPreset.reactants) !== reactantKey) continue;

    return {
      equation: `${reactantSide} -> ${formatParticipants(parsedPreset.products)}`,
      source: 'preset'
    };
  }

  const oxygen = parsedInput.reactants.find(participant => participant.parsed.cleanFormula === 'O2');
  const fuel = parsedInput.reactants.find(participant =>
    participant.parsed.elements.C && participant.parsed.elements.H
  );

  if (parsedInput.reactants.length === 2 && oxygen && fuel) {
    return {
      equation: `${reactantSide} -> CO2 + H2O`,
      source: 'combustion-rule'
    };
  }

  return null;
}

function getFormulaKey(participants: SubstanceParticipant[]): string {
  return participants
    .map(participant => participant.parsed.cleanFormula)
    .sort()
    .join('|');
}

function formatParticipants(participants: SubstanceParticipant[]): string {
  return participants
    .map(participant => participant.coefficient > 1
      ? `${participant.coefficient} ${participant.formula}`
      : participant.formula)
    .join(' + ');
}