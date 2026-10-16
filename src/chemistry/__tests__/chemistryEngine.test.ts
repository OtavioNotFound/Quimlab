import { describe, it, expect } from 'vitest';
import { parseFormula, formatFormulaDisplay } from '../formulaParser';
import { parseEquation } from '../equationParser';
import { balanceEquation } from '../balancer';
import { classifyReaction } from '../reactionClassifier';
import { SUBSTANCE_CATALOG, findSubstanceInCatalog } from '../substanceCatalog';
import { predictReactionProducts } from '../productPredictor';
import { getAllElements } from '../periodicTable';

describe('QuimLab Chemical Engine', () => {
  describe('Periodic table data', () => {
    it('contains each atomic number from 1 through 118 exactly once', () => {
      const elements = getAllElements();

      expect(elements).toHaveLength(118);
      expect(elements.map(element => element.atomicNumber)).toEqual(
        Array.from({ length: 118 }, (_, index) => index + 1)
      );
    });
  });

  describe('Product Predictor', () => {
    it('completa reagentes que correspondem a um exemplo conhecido', () => {
      expect(predictReactionProducts('H2 + O2 ->')?.equation).toBe('H2 + O2 -> H2O');
    });

    it('sugere produtos para combustão completa de um hidrocarboneto', () => {
      expect(predictReactionProducts('C3H8 + O2')?.equation).toBe('C3H8 + O2 -> CO2 + H2O');
    });

    it.each([
      ['H2SO4 + NaOH', 'H2SO4 + NaOH -> Na2SO4 + H2O'],
      ['KI + Pb(NO3)2 ->', 'KI + Pb(NO3)2 -> PbI2 + KNO3'],
      ['KClO3', 'KClO3 -> KCl + O2'],
      ['C2H5OH + CH3COOH', 'C2H5OH + CH3COOH -> CH3COOC2H5 + H2O'],
      ['CuSO4 + NaOH', 'CuSO4 + NaOH -> Cu(OH)2 + Na2SO4']
    ])('prevê e permite balancear a reação %s', (reactants, expectedEquation) => {
      const prediction = predictReactionProducts(reactants);
      expect(prediction?.equation).toBe(expectedEquation);

      const balanced = balanceEquation(prediction!.equation);
      expect(balanced.success).toBe(true);
      expect(balanced.isConserved).toBe(true);
    });

    it('reconhece os mesmos reagentes em qualquer ordem', () => {
      expect(predictReactionProducts('NaOH + HCl')?.products).toEqual(['NaCl', 'H2O']);
    });

    it('não aplica a regra de combustão a combustível com outro elemento', () => {
      expect(predictReactionProducts('CH3Cl + O2')).toBeNull();
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

    it('deve aceitar participantes sem espaços ao redor do sinal de adição', () => {
      const equation = parseEquation('HCl+NaOH->NaCl+H2O');
      expect(equation.isValid).toBe(true);
      expect(equation.reactants.map(participant => participant.formula)).toEqual(['HCl', 'NaOH']);
      expect(equation.products.map(participant => participant.formula)).toEqual(['NaCl', 'H2O']);
      expect(predictReactionProducts('HCl+NaOH')?.products).toEqual(['NaCl', 'H2O']);
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
    it('inclui exemplos escolares adicionais com massa e composição coerentes com o parser', () => {
      const formulas = [
        'MgO', 'Mg(OH)2', 'KOH', 'CaCl2', 'Na2SO4', 'BaSO4', 'KNO3', 'NH4NO3',
        'H3PO4', 'H2S', 'SO2', 'SO3', 'NO', 'NO2', 'N2O', 'C2H6', 'C3H8',
        'C2H4', 'C2H2', 'CH3OH', 'Al2O3', 'CuO', 'PbI2', 'NaF'
      ];

      for (const formula of formulas) {
        const substance = findSubstanceInCatalog(formula);
        const parsed = parseFormula(formula);

        expect(substance, formula).toBeDefined();
        expect(substance?.composition, formula).toEqual(parsed.elements);
        expect(substance?.molarMass, formula).toBe(parsed.molarMass);
      }

      expect(SUBSTANCE_CATALOG.length).toBeGreaterThanOrEqual(400);

      const ids = SUBSTANCE_CATALOG.map(substance => substance.id);
      expect(ids.every(Boolean)).toBe(true);
      expect(new Set(ids).size).toBe(SUBSTANCE_CATALOG.length);

      const propanolIsomers = SUBSTANCE_CATALOG
        .filter(substance => substance.formula === 'C3H8O')
        .map(substance => substance.preferredName);
      expect(propanolIsomers).toEqual(expect.arrayContaining(['Propan-1-ol', 'Propan-2-ol']));
    });

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
