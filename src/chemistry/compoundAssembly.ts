import { parseEquation } from './equationParser';
import { SUBSTANCE_CATALOG } from './substanceCatalog';
import { predictReactionProducts } from './productPredictor';
import type { ElementCount } from './types';

export interface CompoundAssembly {
  equation: string;
  formula: string;
  name: string;
  explanation: string;
}

const arrow = /<=>|<->|⇌|-->|->|==>|=>|→|=/;
const compositionKey = (elements: ElementCount) => Object.entries(elements).sort(([a], [b]) => a.localeCompare(b)).map(([element, count]) => `${element}:${count}`).join('|');

/** Matches atom totals to catalogued formulas; this is not a reaction prediction. */
export function suggestCompoundAssembly(input: string): CompoundAssembly | null {
  const parts = input.trim().split(arrow);
  if (parts.length > 2 || parts[1]?.trim()) return null;
  const reactantSide = parts[0]?.trim();
  if (!reactantSide || predictReactionProducts(reactantSide)) return null;
  const parsed = parseEquation(`${reactantSide} -> H2O`);
  if (!parsed.isValid || parsed.reactants.length < 2) return null;

  const totals: ElementCount = {};
  for (const participant of parsed.reactants) {
    if (participant.parsed.charge) return null;
    for (const [element, count] of Object.entries(participant.parsed.elements)) {
      totals[element] = (totals[element] ?? 0) + count * participant.coefficient;
    }
  }
  // Organic atom counts cannot determine connectivity, even if the catalog has only one isomer.
  if (totals.C && totals.H) return null;
  const key = compositionKey(totals);
  const matches = SUBSTANCE_CATALOG.filter(substance => compositionKey(substance.composition) === key);
  // Atom counts cannot distinguish isomers. Never choose an arbitrary formula among them.
  if (new Set(matches.map(match => match.formula)).size !== 1) return null;
  const compound = matches[0];
  const sulfate = parsed.reactants.some(participant => participant.parsed.cleanFormula === 'SO4');
  return {
    equation: `${reactantSide} -> ${compound.formula}`,
    formula: compound.formula,
    name: compound.preferredName,
    explanation: sulfate
      ? 'SO4 costuma indicar o íon sulfato, SO₄²⁻. A soma dos átomos permite montar esta fórmula, mas H₂ + SO₄ não comprova uma reação de formação.'
      : 'A soma dos átomos corresponde a este composto do catálogo. Esta montagem formal não comprova que as substâncias reagem nem determina sua estrutura.'
  };
}

/** Keep the distinction visible for completed equations, including shared URLs. */
export function isFormalCompoundAssembly(input: string): boolean {
  const parsed = parseEquation(input);
  if (!parsed.isValid || parsed.products.length !== 1) return false;
  const reactantSide = input.split(arrow)[0];
  const suggestion = suggestCompoundAssembly(reactantSide);
  return Boolean(suggestion && parsed.products[0].parsed.cleanFormula === suggestion.formula && parsed.products[0].coefficient === 1);
}
