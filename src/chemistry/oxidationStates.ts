import { ParsedEquation, RedoxAnalysisResult, ElementOxidationState } from './types';
import { getElement } from './periodicTable';

/**
 * Atribui estados de oxidação (Nox) médios aos elementos de uma fórmula química
 * baseando-se nas regras fundamentais de eletronegatividade e valência.
 */
export function estimateFormulaNox(formula: string, elements: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};
  const elemKeys = Object.keys(elements);

  // 1. Substância simples: Nox = 0
  if (elemKeys.length === 1) {
    result[elemKeys[0]] = 0;
    return result;
  }

  // 2. Regras fixas/prioritárias
  let fixedSum = 0;
  let remainingElem: string | null = null;
  let remainingCount = 0;

  for (const el of elemKeys) {
    const count = elements[el];

    if (el === 'F') {
      result[el] = -1;
      fixedSum += -1 * count;
    } else if (['Li', 'Na', 'K', 'Rb', 'Cs'].includes(el)) {
      result[el] = 1;
      fixedSum += 1 * count;
    } else if (['Be', 'Mg', 'Ca', 'Sr', 'Ba'].includes(el)) {
      result[el] = 2;
      fixedSum += 2 * count;
    } else if (el === 'Al') {
      result[el] = 3;
      fixedSum += 3 * count;
    } else if (el === 'Zn') {
      result[el] = 2;
      fixedSum += 2 * count;
    } else if (el === 'Ag') {
      result[el] = 1;
      fixedSum += 1 * count;
    } else if (el === 'H') {
      // Hidrogênio normalmente +1 (exceto se só tiver metais)
      const hasOnlyMetals = elemKeys.every(k => k === 'H' || getElement(k)?.category?.includes('metal'));
      const noxH = hasOnlyMetals ? -1 : 1;
      result[el] = noxH;
      fixedSum += noxH * count;
    } else if (el === 'O') {
      // Oxigênio normalmente -2 (exceto H2O2 e peróxidos)
      const isPeroxide = formula === 'H2O2' || formula === 'Na2O2';
      const noxO = isPeroxide ? -1 : -2;
      result[el] = noxO;
      fixedSum += noxO * count;
    } else if (['Cl', 'Br', 'I'].includes(el) && !elemKeys.includes('O')) {
      // Haletos binários sem oxigênio têm Nox -1
      result[el] = -1;
      fixedSum += -1 * count;
    } else if (el === 'S' && !elemKeys.includes('O') && elemKeys.some(k => ['H', 'Na', 'Fe', 'Cu', 'Zn'].includes(k))) {
      // Sulfetos binários têm Nox -2
      result[el] = -2;
      fixedSum += -2 * count;
    } else {
      remainingElem = el;
      remainingCount = count;
    }
  }

  // 3. O elemento central/restante compensa para a soma ser 0
  if (remainingElem && remainingCount > 0) {
    const needed = -fixedSum;
    result[remainingElem] = Number((needed / remainingCount).toFixed(2));
  } else {
    // Se sobrar algum sem definir, tenta preencher com Nox padrão mais comum
    for (const el of elemKeys) {
      if (result[el] === undefined) {
        const d = getElement(el);
        result[el] = d?.commonOxidationStates?.[0] || 0;
      }
    }
  }

  return result;
}

/**
 * Analisa uma equação química balanceada e determina variações de Nox,
 * identificando se é uma reação de oxirredução (Redox), quem oxidou e quem reduziu.
 */
export function analyzeRedox(equation: ParsedEquation): RedoxAnalysisResult {
  if (!equation.isValid || equation.reactants.length === 0 || equation.products.length === 0) {
    return {
      isRedox: false,
      elementStates: [],
      explanation: 'Equação inválida para análise redox.'
    };
  }

  // Mapeia Nox de cada elemento nos reagentes e produtos
  const reactantNoxMap: Record<string, { nox: number; formula: string }> = {};
  const productNoxMap: Record<string, { nox: number; formula: string }> = {};

  equation.reactants.forEach(r => {
    const noxMap = estimateFormulaNox(r.parsed.cleanFormula, r.parsed.elements);
    for (const [el, val] of Object.entries(noxMap)) {
      if (reactantNoxMap[el] === undefined) {
        reactantNoxMap[el] = { nox: val, formula: r.formula };
      }
    }
  });

  equation.products.forEach(p => {
    const noxMap = estimateFormulaNox(p.parsed.cleanFormula, p.parsed.elements);
    for (const [el, val] of Object.entries(noxMap)) {
      if (productNoxMap[el] === undefined) {
        productNoxMap[el] = { nox: val, formula: p.formula };
      }
    }
  });

  const commonElements = Object.keys(reactantNoxMap).filter(el => productNoxMap[el] !== undefined);
  const elementStates: ElementOxidationState[] = [];

  let oxidizedElement: string | undefined;
  let reducedElement: string | undefined;
  let reducingAgent: string | undefined;
  let oxidizingAgent: string | undefined;
  let isRedox = false;

  for (const el of commonElements) {
    const rData = reactantNoxMap[el];
    const pData = productNoxMap[el];
    const diff = pData.nox - rData.nox;
    const elData = getElement(el);
    const name = elData ? elData.name : el;

    let role: 'oxidized' | 'reduced' | 'unchanged' = 'unchanged';

    if (diff > 0) {
      role = 'oxidized';
      oxidizedElement = el;
      reducingAgent = rData.formula;
      isRedox = true;
    } else if (diff < 0) {
      role = 'reduced';
      reducedElement = el;
      oxidizingAgent = rData.formula;
      isRedox = true;
    }

    elementStates.push({
      element: el,
      name,
      reactantNox: rData.nox,
      productNox: pData.nox,
      role,
      electronsDelta: diff
    });
  }

  let explanation = '';
  if (isRedox) {
    const oxText = oxidizedElement
      ? `O elemento ${oxidizedElement} sofreu oxidação (Nox aumentou de ${reactantNoxMap[oxidizedElement].nox} para ${productNoxMap[oxidizedElement].nox}, perda de elétrons), atuando o composto ${reducingAgent} como agente redutor.`
      : '';
    const redText = reducedElement
      ? `O elemento ${reducedElement} sofreu redução (Nox diminuiu de ${reactantNoxMap[reducedElement].nox} para ${productNoxMap[reducedElement].nox}, ganho de elétrons), atuando o composto ${oxidizingAgent} como agente oxidante.`
      : '';
    explanation = `Trata-se de uma reação de oxirredução (Redox) com transferência de elétrons. ${oxText} ${redText}`;
  } else {
    explanation = 'Não houve variação nos números de oxidação (Nox) dos elementos participantes. Não é uma reação de oxirredução.';
  }

  return {
    isRedox,
    elementStates,
    oxidizedElement,
    reducedElement,
    reducingAgent,
    oxidizingAgent,
    explanation
  };
}
