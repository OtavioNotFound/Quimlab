import { SUBSTANCE_CATALOG } from '../chemistry/substanceCatalog';

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const catalogIndex = SUBSTANCE_CATALOG.map(substance => ({
  formula: substance.formula,
  name: substance.preferredName,
  aliases: [substance.preferredName, ...substance.commonNames].map(normalize),
  normalizedFormula: normalize(substance.formula)
}));

export interface FormulaToken { start: number; end: number; query: string }

/** Select only the substance at the caret, retaining coefficients and equation separators. */
export function getFormulaToken(value: string, caret: number, equation: boolean): FormulaToken | null {
  let start = 0;
  let end = value.length;
  if (equation) {
    for (const match of value.matchAll(/<=>|<->|⇌|-->|->|==>|=>|→|=|\+/g)) {
      const separatorStart = match.index;
      const separatorEnd = separatorStart + match[0].length;
      if (caret > separatorStart && caret < separatorEnd) return null;
      if (separatorEnd <= caret) start = separatorEnd;
      else { end = separatorStart; break; }
    }
  }
  const segment = value.slice(start, end);
  const leading = segment.match(/^\s*(?:\d+\s*)?/)?.[0].length ?? 0;
  start += leading;
  end -= segment.length - segment.trimEnd().length;
  if (caret < start || end <= start) return null;
  return { start, end, query: value.slice(start, end) };
}

export function findFormulaSuggestions(query: string, limit = 6) {
  const needle = normalize(query.trim());
  if (!needle) return [];
  const seen = new Set<string>();
  return catalogIndex.map(item => {
    const rank = item.normalizedFormula === needle ? 0
      : item.normalizedFormula.startsWith(needle) ? 1
      : item.aliases.some(name => name.startsWith(needle)) ? 2
      : item.aliases.some(name => name.includes(needle)) ? 3 : 4;
    return { ...item, rank };
  }).filter(item => item.rank < 4).sort((a, b) => a.rank - b.rank)
    .filter(item => { if (seen.has(item.formula)) return false; seen.add(item.formula); return true; })
    .slice(0, limit);
}

export function completeFormula(value: string, token: FormulaToken, formula: string) {
  return { value: value.slice(0, token.start) + formula + value.slice(token.end), caret: token.start + formula.length };
}
