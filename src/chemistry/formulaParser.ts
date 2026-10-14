import { ElementCount, ParsedFormula, StateOfMatter } from './types';
import { getElement, isValidElement } from './periodicTable';

/**
 * Converte números normais em caracteres subscritos unicode para exibição rica.
 */
export function toSubscript(numStr: string): string {
  const map: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '⁺', '-': '⁻'
  };
  return numStr.split('').map(c => map[c] || c).join('');
}

/**
 * Converte fórmulas de texto plano em representação visual formatada com subscritos.
 * Exemplo: Ca(OH)2 -> Ca(OH)₂; CuSO4.5H2O -> CuSO₄ · 5H₂O
 */
export function formatFormulaDisplay(formula: string): string {
  // Trata hidratos
  const hydrateSplit = formula.split(/[·*]|(?<=[A-Za-z0-9\)])\.(?=\d*[A-Z])/);
  if (hydrateSplit.length > 1) {
    return hydrateSplit.map(part => formatSimpleFormula(part.trim())).join(' · ');
  }
  return formatSimpleFormula(formula);
}

function formatSimpleFormula(formula: string): string {
  return formula
    .replace(/(?<=[A-Za-z\)\]])(\d+)/g, (_, match) => toSubscript(match))
    .replace(/\^([0-9]*[\+\-])/g, (_, match) => toSuperscript(match));
}

function toSuperscript(str: string): string {
  const map: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻'
  };
  return str.split('').map(c => map[c] || c).join('');
}

/**
 * Parser de fórmula química com validação e cálculo de composição atômica.
 */
export function parseFormula(rawInput: string): ParsedFormula {
  if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
    throw new Error('Fórmula química vazia ou inválida.');
  }

  let text = rawInput.trim();

  // 1. Extração de estado físico: (s), (l), (g), (aq)
  let state: StateOfMatter | undefined;
  const stateMatch = text.match(/\((s|l|g|aq)\)$/i);
  if (stateMatch) {
    state = stateMatch[1].toLowerCase() as StateOfMatter;
    text = text.slice(0, stateMatch.index).trim();
  }

  // 2. Extração de carga elétrica: e.g. ^2+, 2+, +, -, ^-, ^{2-}
  let charge = 0;
  const chargeMatch = text.match(/[\^]?(\{?([0-9]*)([\+\-])\}?)$/);
  if (chargeMatch && !text.endsWith(')') && !text.endsWith(']')) {
    // Verificar se não é apenas um elemento ou parêntese
    const sign = chargeMatch[3] === '-' ? -1 : 1;
    const mag = chargeMatch[2] ? parseInt(chargeMatch[2], 10) : 1;
    // Evitar falsos positivos se o usuário digitou algo inválido
    if (!isNaN(mag)) {
      charge = sign * mag;
      text = text.slice(0, chargeMatch.index).trim();
    }
  }

  // 3. Detecção de hidratos: e.g. CuSO4·5H2O, FeSO4*7H2O, CaCl2.2H2O
  let hydrateCount: number | undefined;
  let hydrateFormula: string | undefined;
  let mainPart = text;
  let hydratePart = '';

  const dotIdx = text.search(/[·*]|(?<=[A-Za-z0-9\)])\.(?=\d*[A-Z])/);
  if (dotIdx !== -1) {
    mainPart = text.slice(0, dotIdx).trim();
    hydratePart = text.slice(dotIdx + 1).trim();

    const hydrateMatch = hydratePart.match(/^(\d*)([A-Za-z0-9\(\)]+)$/);
    if (hydrateMatch) {
      hydrateCount = hydrateMatch[1] ? parseInt(hydrateMatch[1], 10) : 1;
      hydrateFormula = hydrateMatch[2];
    }
  }

  // 4. Parse dos elementos da parte principal
  const mainCounts = parseSubFormula(mainPart);

  // Se houver hidrato, soma os elementos do hidrato
  if (hydrateCount && hydrateFormula) {
    const hydrateCounts = parseSubFormula(hydrateFormula);
    for (const [elem, count] of Object.entries(hydrateCounts)) {
      mainCounts[elem] = (mainCounts[elem] || 0) + count * hydrateCount;
    }
  }

  // 5. Cálculo da massa molar
  let molarMass = 0;
  for (const [elem, count] of Object.entries(mainCounts)) {
    const elData = getElement(elem);
    if (!elData) {
      throw new Error(`Elemento químico desconhecido: "${elem}" na fórmula "${rawInput}".`);
    }
    molarMass += elData.atomicMass * count;
  }

  return {
    raw: rawInput,
    cleanFormula: text,
    elements: mainCounts,
    molarMass: Math.round(molarMass * 1000) / 1000,
    state,
    charge: charge !== 0 ? charge : undefined,
    hydrateCount,
    hydrateFormula
  };
}

/**
 * Parser de bloco de fórmula com suporte a parênteses aninhados: Ca(OH)2, Al2(SO4)3, etc.
 */
function parseSubFormula(formula: string): ElementCount {
  const stack: ElementCount[] = [{}];
  let i = 0;
  const n = formula.length;

  while (i < n) {
    const ch = formula[i];

    if (ch === '(' || ch === '[') {
      stack.push({});
      i++;
    } else if (ch === ')' || ch === ']') {
      if (stack.length <= 1) {
        throw new Error(`Parêntese de fechamento "${ch}" sem abertura correspondente na fórmula "${formula}".`);
      }
      i++;
      // Ler número multiplicador após parêntese
      let numStr = '';
      while (i < n && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const multiplier = numStr.length > 0 ? parseInt(numStr, 10) : 1;
      const groupCounts = stack.pop()!;
      const target = stack[stack.length - 1];

      for (const [elem, cnt] of Object.entries(groupCounts)) {
        target[elem] = (target[elem] || 0) + cnt * multiplier;
      }
    } else if (/[A-Z]/.test(ch)) {
      // Elemento: Letra maiúscula seguida opcionalmente de letra minúscula
      let symbol = ch;
      i++;
      if (i < n && /[a-z]/.test(formula[i])) {
        symbol += formula[i];
        i++;
      }

      if (!isValidElement(symbol)) {
        throw new Error(`Elemento "${symbol}" não existe na tabela periódica.`);
      }

      // Ler índice numérico
      let numStr = '';
      while (i < n && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const count = numStr.length > 0 ? parseInt(numStr, 10) : 1;

      const target = stack[stack.length - 1];
      target[symbol] = (target[symbol] || 0) + count;
    } else if (/\s/.test(ch)) {
      // Pular espaços em branco eventuais
      i++;
    } else {
      throw new Error(`Caractere inesperado "${ch}" na fórmula química "${formula}".`);
    }
  }

  if (stack.length !== 1) {
    throw new Error(`Parêntese não fechado na fórmula "${formula}".`);
  }

  const result = stack[0];
  if (Object.keys(result).length === 0) {
    throw new Error(`Nenhum elemento químico identificado na fórmula "${formula}".`);
  }

  return result;
}
