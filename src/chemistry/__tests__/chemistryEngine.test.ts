import { describe, it, expect } from 'vitest';
import { parseFormula, formatFormulaDisplay } from '../formulaParser';
import { parseEquation } from '../equationParser';
import { balanceEquation } from '../balancer';
import { classifyReaction } from '../reactionClassifier';
import { findSubstanceInCatalog } from '../substanceCatalog';
import { predictReactionProducts } from '../productPredictor';

describe('QuimLab Chemical Engine', () => {
  describe('Product Predictor', () => {
    it('completa reagentes que correspondem a um exemplo conhecido', () => {
      expect(predictReactionProducts('H2 + O2 ->')?.equation).toBe('H2 + O2 -> H2O');
    });

    it('sugere produtos para combustão completa de um hidrocarboneto', () => {
      expect(predictReactionProducts('C3H8 + O2')?.equation).toBe('C3H8 + O2 -> CO2 + H2O');
    });

    it('não inventa produtos para uma reação desconhecida', () => {
      expect(predictReactionProducts('Na + H2O ->')).toBeNull();
    });
  });

  describe('Formula Parser', () => {
    it('deve interpretar fórmulas simples corretamente', () => {
      const h2o = parseFormula('H2O');
      expect(h2o.elements).toEqual({ H: 2, O: 1 });
      expect(h2o.molarMass).toBeCloseTo(18.015, 2);

      const co2 = parseFormula('CO2');
      expect(co2.elements).toEqual({ C: 1, O: 2 });
      expect(co2.molarMass).toBeCloseTo(44.01, 1);
    });

    it('deve interpretar fórmulas com parênteses e subgrupos', () => {
      const caoh2 = parseFormula('Ca(OH)2');
      expect(caoh2.elements).toEqual({ Ca: 1, O: 2, H: 2 });
      expect(caoh2.molarMass).toBeCloseTo(74.09, 1);

      const al2so43 = parseFormula('Al2(SO4)3');
      expect(al2so43.elements).toEqual({ Al: 2, S: 3, O: 12 });
      expect(al2so43.molarMass).toBeCloseTo(342.15, 1);
    });

    it('deve extrair estados físicos e hidratos', () => {
      const naclSolid = parseFormula('NaCl(s)');
      expect(naclSolid.state).toBe('s');
      expect(naclSolid.elements).toEqual({ Na: 1, Cl: 1 });

      const hydrate = parseFormula('CuSO4·5H2O');
      expect(hydrate.hydrateCount).toBe(5);
      expect(hydrate.elements).toEqual({ Cu: 1, S: 1, O: 9, H: 10 });
    });

    it('deve lançar erro para símbolos inexistentes ou sintaxe inválida', () => {
      expect(() => parseFormula('Xx2O')).toThrow();
      expect(() => parseFormula('Ca(OH')).toThrow();
      expect(() => parseFormula('')).toThrow();
    });

    it('deve formatar subscritos para exibição', () => {
      expect(formatFormulaDisplay('H2O')).toBe('H₂O');
      expect(formatFormulaDisplay('Ca(OH)2')).toBe('Ca(OH)₂');
    });
  });

  describe('Equation Balancer', () => {
    it('deve balancear síntese simples H2 + O2 -> H2O', () => {
      const result = balanceEquation('H2 + O2 -> H2O');
      expect(result.success).toBe(true);
      expect(result.reactantsCoefficients).toEqual([2, 1]);
      expect(result.productsCoefficients).toEqual([2]);
      expect(result.isConserved).toBe(true);
      expect(result.balancedEquation).toBe('2 H2 + O2 → 2 H2O');
    });

    it('deve balancear oxidação do ferro Fe + O2 -> Fe2O3', () => {
      const result = balanceEquation('Fe + O2 -> Fe2O3');
      expect(result.success).toBe(true);
      expect(result.reactantsCoefficients).toEqual([4, 3]);
      expect(result.productsCoefficients).toEqual([2]);
      expect(result.isConserved).toBe(true);
      expect(result.balancedEquation).toBe('4 Fe + 3 O2 → 2 Fe2O3');
    });

    it('deve balancear combustão de hidrocarboneto CH4 + O2 -> CO2 + H2O', () => {
      const result = balanceEquation('CH4 + O2 -> CO2 + H2O');
      expect(result.success).toBe(true);
      expect(result.reactantsCoefficients).toEqual([1, 2]);
      expect(result.productsCoefficients).toEqual([1, 2]);
      expect(result.balancedEquation).toBe('CH4 + 2 O2 → CO2 + 2 H2O');
    });

    it('deve manter equações já balanceadas CaCO3 -> CaO + CO2', () => {
      const result = balanceEquation('CaCO3 -> CaO + CO2');
      expect(result.success).toBe(true);
      expect(result.reactantsCoefficients).toEqual([1]);
      expect(result.productsCoefficients).toEqual([1, 1]);
    });

    it('deve balancear reação complexa com múltiplos participantes KMnO4 + HCl', () => {
      const result = balanceEquation('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2');
      expect(result.success).toBe(true);
      expect(result.reactantsCoefficients).toEqual([2, 16]);
      expect(result.productsCoefficients).toEqual([2, 2, 8, 5]);
      expect(result.isConserved).toBe(true);
    });

    it('deve balancear dupla troca com sulfato de alumínio Al2(SO4)3 + Ca(OH)2 -> Al(OH)3 + CaSO4', () => {
      const result = balanceEquation('Al2(SO4)3 + Ca(OH)2 -> Al(OH)3 + CaSO4');
      expect(result.success).toBe(true);
      expect(result.reactantsCoefficients).toEqual([1, 3]);
      expect(result.productsCoefficients).toEqual([2, 3]);
      expect(result.isConserved).toBe(true);
    });

    it('deve rejeitar equações com violação da conservação da massa', () => {
      const result = balanceEquation('H2 + O2 -> NaCl');
      expect(result.success).toBe(false);
      expect(result.error).toContain('violação da conservação da matéria');
    });

    it('deve preservar a carga positiva ao separar participantes', () => {
      const equation = parseEquation('Fe^3+ + 3 OH^- -> Fe(OH)3');
      expect(equation.isValid).toBe(true);
      expect(equation.reactants.map(participant => participant.parsed.charge)).toEqual([3, -1]);

      const result = balanceEquation(equation);
      expect(result.success).toBe(true);
      expect(result.isConserved).toBe(true);
    });
  });

  describe('Reaction Classifier', () => {
    it('deve classificar síntese', () => {
      const eq = parseEquation('2 H2 + O2 -> 2 H2O');
      const classification = classifyReaction(eq);
      const categories = classification.classifications.map(c => c.category);
      expect(categories).toContain('synthesis');
    });

    it('deve classificar decomposição', () => {
      const eq = parseEquation('CaCO3 -> CaO + CO2');
      const classification = classifyReaction(eq);
      const categories = classification.classifications.map(c => c.category);
      expect(categories).toContain('decomposition');
    });

    it('deve classificar simples troca e redox', () => {
      const eq = parseEquation('Zn + 2 HCl -> ZnCl2 + H2');
      const classification = classifyReaction(eq);
      const categories = classification.classifications.map(c => c.category);
      expect(categories).toContain('single_replacement');
      expect(categories).toContain('redox');
    });

    it('deve classificar neutralização', () => {
      const eq = parseEquation('HCl + NaOH -> NaCl + H2O');
      const classification = classifyReaction(eq);
      const categories = classification.classifications.map(c => c.category);
      expect(categories).toContain('neutralization');
    });

    it('deve classificar combustão completa', () => {
      const eq = parseEquation('CH4 + 2 O2 -> CO2 + 2 H2O');
      const classification = classifyReaction(eq);
      const categories = classification.classifications.map(c => c.category);
      expect(categories).toContain('combustion');
      expect(categories).toContain('redox');
    });
  });

  describe('Substance Catalog', () => {
    it('deve localizar substâncias conhecidas por fórmula e composição', () => {
      const water = findSubstanceInCatalog('H2O');
      expect(water).toBeDefined();
      expect(water?.preferredName).toBe('Água');

      const salt = findSubstanceInCatalog('NaCl');
      expect(salt).toBeDefined();
      expect(salt?.commonNames).toContain('Sal de cozinha');

      const acid = findSubstanceInCatalog('HCl');
      expect(acid).toBeDefined();
      expect(acid?.preferredName).toBe('Ácido clorídrico');
    });
  });
});
