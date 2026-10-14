import { AtomBalanceRow, ElementCount, SubstanceParticipant } from './types';
import { getElement } from './periodicTable';

/**
 * Calcula a contagem total de átomos por elemento em uma lista de participantes.
 */
export function countAtomsInParticipants(
  participants: SubstanceParticipant[],
  customCoefficients?: number[]
): ElementCount {
  const totals: ElementCount = {};

  participants.forEach((p, idx) => {
    const coeff = customCoefficients && customCoefficients[idx] !== undefined
      ? customCoefficients[idx]
      : p.coefficient;

    for (const [elem, cnt] of Object.entries(p.parsed.elements)) {
      totals[elem] = (totals[elem] || 0) + cnt * coeff;
    }
  });

  return totals;
}

/**
 * Compara a contagem de átomos entre reagentes e produtos e produz a tabela de balanceamento.
 */
export function buildAtomTable(
  reactants: SubstanceParticipant[],
  products: SubstanceParticipant[],
  reactantCoeffs?: number[],
  productCoeffs?: number[]
): {
  table: AtomBalanceRow[];
  isBalanced: boolean;
  missingInReactants: string[];
  missingInProducts: string[];
} {
  const rCounts = countAtomsInParticipants(reactants, reactantCoeffs);
  const pCounts = countAtomsInParticipants(products, productCoeffs);

  const allElements = Array.from(new Set([...Object.keys(rCounts), ...Object.keys(pCounts)])).sort();

  const missingInReactants: string[] = [];
  const missingInProducts: string[] = [];
  let isBalanced = true;

  const table: AtomBalanceRow[] = allElements.map(el => {
    const r = rCounts[el] || 0;
    const p = pCounts[el] || 0;
    const balanced = r === p && r > 0;

    if (r === 0) missingInReactants.push(el);
    if (p === 0) missingInProducts.push(el);

    if (!balanced) {
      isBalanced = false;
    }

    const elData = getElement(el);
    const name = elData ? elData.name : el;

    return {
      element: el,
      name,
      reactantsCount: r,
      productsCount: p,
      isBalanced: balanced
    };
  });

  return {
    table,
    isBalanced: isBalanced && missingInReactants.length === 0 && missingInProducts.length === 0,
    missingInReactants,
    missingInProducts
  };
}
