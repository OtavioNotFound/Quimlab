import { ParsedEquation, ParsedFormula, MassPercentageItem, StoichiometryResult, StoichiometryItem } from './types';
import { getElement } from './periodicTable';
import { findSubstanceInCatalog } from './substanceCatalog';

/**
 * Calcula a composição centesimal (porcentagem em massa de cada elemento) de uma fórmula.
 * Exemplo: H2O -> H: 11.19%, O: 88.81%
 */
export function calculateMassPercentages(parsed: ParsedFormula): MassPercentageItem[] {
  const totalMass = parsed.molarMass;
  if (!totalMass || totalMass <= 0) return [];

  return Object.entries(parsed.elements).map(([symbol, count]) => {
    const elData = getElement(symbol);
    const atomicMass = elData?.atomicMass || 0;
    const elemTotalMass = atomicMass * count;
    const percentage = Number(((elemTotalMass / totalMass) * 100).toFixed(2));

    return {
      element: symbol,
      name: elData?.name || symbol,
      count,
      atomicMass,
      totalMass: Number(elemTotalMass.toFixed(3)),
      percentage
    };
  }).sort((a, b) => b.percentage - a.percentage);
}

export interface ParticipantInputAmount {
  index: number; // Índice no array de participantes (reagentes primeiro, depois produtos)
  role: 'reactant' | 'product';
  value: number;
  unit: 'g' | 'mol';
}

/**
 * Realiza cálculos estequiométricos com base nos coeficientes balanceados da reação.
 * Suporta cálculo a partir de um valor conhecido e identificação de reagente limitante / excesso.
 */
export function calculateStoichiometry(
  equation: ParsedEquation,
  reactantAmounts: { [reactantIdx: number]: { value: number; unit: 'g' | 'mol' } }
): StoichiometryResult {
  if (!equation.isValid || equation.reactants.length === 0 || equation.products.length === 0) {
    return {
      items: [],
      excessReagents: [],
      explanation: 'Equação inválida para cálculo estequiométrico.'
    };
  }

  // 1. Converte entradas dos reagentes para mols
  const reactantMolsGiven: { [idx: number]: number } = {};
  const activeReactantIndices = Object.keys(reactantAmounts).map(Number).filter(idx => {
    const val = reactantAmounts[idx]?.value;
    return typeof val === 'number' && val > 0;
  });

  if (activeReactantIndices.length === 0) {
    // Se nenhum valor foi fornecido, usa a proporção estequiométrica padrão (1x coeficientes)
    const items: StoichiometryItem[] = [
      ...equation.reactants.map(r => {
        const moles = r.coefficient;
        const massGrams = Number((moles * r.parsed.molarMass).toFixed(3));
        const cat = findSubstanceInCatalog(r.parsed.cleanFormula);
        return {
          formula: r.formula,
          name: cat?.preferredName || r.formula,
          role: 'reactant' as const,
          coefficient: r.coefficient,
          molarMass: Number(r.parsed.molarMass.toFixed(3)),
          moles,
          massGrams
        };
      }),
      ...equation.products.map(p => {
        const moles = p.coefficient;
        const massGrams = Number((moles * p.parsed.molarMass).toFixed(3));
        const cat = findSubstanceInCatalog(p.parsed.cleanFormula);
        return {
          formula: p.formula,
          name: cat?.preferredName || p.formula,
          role: 'product' as const,
          coefficient: p.coefficient,
          molarMass: Number(p.parsed.molarMass.toFixed(3)),
          moles,
          massGrams
        };
      })
    ];

    return {
      items,
      excessReagents: [],
      explanation: 'Exibindo a proporção estequiométrica ideal baseada nos coeficientes inteiros mínimos da reação.'
    };
  }

  activeReactantIndices.forEach(idx => {
    const input = reactantAmounts[idx];
    const participant = equation.reactants[idx];
    if (input.unit === 'mol') {
      reactantMolsGiven[idx] = input.value;
    } else {
      // Gramas para mols
      reactantMolsGiven[idx] = input.value / participant.parsed.molarMass;
    }
  });

  // 2. Determina o fator de reação e o reagente limitante (se 2+ reagentes foram dados)
  let reactionExtent = 0; // Quantas vezes a reação ocorre em mols estequiométricos
  let limitingIdx: number | null = null;
  const excessReagents: string[] = [];

  if (activeReactantIndices.length === 1) {
    // Apenas 1 valor conhecido
    const idx = activeReactantIndices[0];
    const r = equation.reactants[idx];
    reactionExtent = reactantMolsGiven[idx] / r.coefficient;
  } else {
    // 2 ou mais reagentes informados: encontrar o limitante (menor razão mol/coeficiente)
    let minRatio = Infinity;
    activeReactantIndices.forEach(idx => {
      const r = equation.reactants[idx];
      const ratio = reactantMolsGiven[idx] / r.coefficient;
      if (ratio < minRatio) {
        minRatio = ratio;
        limitingIdx = idx;
      }
    });

    reactionExtent = minRatio;

    activeReactantIndices.forEach(idx => {
      if (idx !== limitingIdx) {
        excessReagents.push(equation.reactants[idx].formula);
      }
    });
  }

  // 3. Constrói a lista final de participantes com mols consumidos/produzidos e massas
  const items: StoichiometryItem[] = [];

  equation.reactants.forEach((r, idx) => {
    const neededMoles = reactionExtent * r.coefficient;
    const cat = findSubstanceInCatalog(r.parsed.cleanFormula);
    const isLimiting = limitingIdx === idx;
    const isExcess = excessReagents.includes(r.formula);

    let excessRemainingGrams: number | undefined;
    if (isExcess && reactantMolsGiven[idx] !== undefined) {
      const remainingMoles = Math.max(0, reactantMolsGiven[idx] - neededMoles);
      excessRemainingGrams = Number((remainingMoles * r.parsed.molarMass).toFixed(3));
    }

    const molesToReport = reactantMolsGiven[idx] !== undefined ? reactantMolsGiven[idx] : neededMoles;
    const massGrams = Number((molesToReport * r.parsed.molarMass).toFixed(3));

    items.push({
      formula: r.formula,
      name: cat?.preferredName || r.formula,
      role: 'reactant',
      coefficient: r.coefficient,
      molarMass: Number(r.parsed.molarMass.toFixed(3)),
      moles: Number(molesToReport.toFixed(4)),
      massGrams,
      isLimiting,
      isExcess,
      excessRemainingGrams
    });
  });

  equation.products.forEach(p => {
    const formedMoles = reactionExtent * p.coefficient;
    const massGrams = Number((formedMoles * p.parsed.molarMass).toFixed(3));
    const cat = findSubstanceInCatalog(p.parsed.cleanFormula);

    items.push({
      formula: p.formula,
      name: cat?.preferredName || p.formula,
      role: 'product',
      coefficient: p.coefficient,
      molarMass: Number(p.parsed.molarMass.toFixed(3)),
      moles: Number(formedMoles.toFixed(4)),
      massGrams
    });
  });

  let explanation = '';
  if (limitingIdx !== null) {
    const limFormula = equation.reactants[limitingIdx].formula;
    explanation = `O reagente limitante é o ${limFormula}, pois sua quantidade é esgotada primeiro e determina o rendimento máximo da reação. Os demais reagentes encontram-se em excesso.`;
  } else {
    explanation = `Cálculo realizado estequiometricamente na proporção da reação balanceada para ${reactionExtent.toFixed(3)} vezes a proporção base.`;
  }

  return {
    items,
    limitingReagent: limitingIdx !== null ? equation.reactants[limitingIdx].formula : undefined,
    excessReagents,
    explanation
  };
}
