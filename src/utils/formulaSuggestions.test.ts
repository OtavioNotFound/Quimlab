import { describe, expect, it } from 'vitest';
import { completeFormula, findFormulaSuggestions, getFormulaToken } from './formulaSuggestions';

describe('formula autocomplete', () => {
  it('finds substances by accent-insensitive names, aliases and formulas', () => {
    expect(findFormulaSuggestions('agua')[0].formula).toBe('H2O');
    expect(findFormulaSuggestions('sal de cozinha')[0].formula).toBe('NaCl');
    expect(findFormulaSuggestions('nacl')[0].formula).toBe('NaCl');
    expect(findFormulaSuggestions('')).toEqual([]);
  });
  it('replaces the substance at the caret and preserves the rest of the equation', () => {
    const value = '2 H2 + oxigenio -> 2 H2O';
    const token = getFormulaToken(value, 12, true)!;
    expect(token.query).toBe('oxigenio');
    expect(completeFormula(value, token, 'O2').value).toBe('2 H2 + O2 -> 2 H2O');
  });
  it('preserves coefficients, state on other terms, reversible arrows and whitespace', () => {
    const value = ' H2(g) ⇌ 3 agua ';
    const token = getFormulaToken(value, 14, true)!;
    expect(completeFormula(value, token, 'H2O').value).toBe(' H2(g) ⇌ 3 H2O ');
    expect(getFormulaToken('H2 -> O2', 4, true)).toBeNull();
    expect(getFormulaToken('H2 + ', 5, true)).toBeNull();
  });
  it('does not duplicate formulas and keeps the suggestion list bounded', () => {
    const suggestions = findFormulaSuggestions('o');
    expect(suggestions.length).toBeLessThanOrEqual(6);
    expect(new Set(suggestions.map(item => item.formula)).size).toBe(suggestions.length);
  });
});
