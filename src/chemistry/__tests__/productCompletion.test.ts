import { describe, expect, it } from 'vitest';
import { suggestCompoundAssembly, isFormalCompoundAssembly } from '../compoundAssembly';
import { predictReactionProducts } from '../productPredictor';
import { balanceEquation } from '../balancer';

describe('product completion with scientific boundaries', () => {
  it('offers the requested sulfuric acid formula as formal assembly, not a reaction prediction', () => {
    expect(predictReactionProducts('H2 + SO4 ->')).toBeNull();
    const suggestion = suggestCompoundAssembly('H2 + SO4 ->');
    expect(suggestion?.formula).toBe('H2SO4');
    expect(suggestion?.explanation).toContain('SO₄²⁻');
    expect(balanceEquation(suggestion!.equation).isConserved).toBe(true);
    expect(isFormalCompoundAssembly(suggestion!.equation)).toBe(true);
  });
  it('never overwrites products or guesses an unknown composition', () => {
    expect(suggestCompoundAssembly('H2 + SO4 -> H2O')).toBeNull();
    expect(suggestCompoundAssembly('H2 + Xe ->')).toBeNull();
    expect(suggestCompoundAssembly('H2 + ->')).toBeNull();
    expect(suggestCompoundAssembly('2 H2 + SO4 ->')).toBeNull();
  });
  it('gives reaction rules priority and rejects ambiguous composition', () => {
    expect(suggestCompoundAssembly('H2 + O2 ->')).toBeNull();
    expect(isFormalCompoundAssembly('2 H2 + O2 -> 2 H2O')).toBe(false);
    // C3H8O has multiple isomers; atom totals cannot identify one.
    const suggestion = suggestCompoundAssembly('C3H8 + O ->');
    expect(suggestion).toBeNull();
  });
  it.each([
    ['HBr + Ca(OH)2 ->', 'CaBr2'],
    ['HNO3 + Ba(OH)2', 'Ba(NO3)2'],
    ['H3PO4 + KOH ->', 'K3PO4'],
    ['CH3COOH + Ca(OH)2', 'Ca(CH3COO)2'],
    ['Al(OH)3 + H2SO4 ->', 'Al2(SO4)3']
  ])('completes and balances bounded neutralization rule: %s', (input, salt) => {
    const prediction = predictReactionProducts(input)!;
    expect(prediction.products).toEqual([salt, 'H2O']);
    expect(prediction.assumptions.join(' ')).toContain('Neutralização total');
    expect(balanceEquation(prediction.equation).isConserved).toBe(true);
  });
  it('does not apply the new aqueous rule to explicit gas or solid states', () => {
    expect(predictReactionProducts('HBr(g) + Ca(OH)2(s) ->')).toBeNull();
  });
  it('makes the oxygen assumption explicit', () => {
    expect(predictReactionProducts('C3H8 + O2 ->')?.assumptions.join(' ')).toContain('oxigênio');
  });
});
