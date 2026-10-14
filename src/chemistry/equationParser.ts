import { ParsedEquation, SubstanceParticipant } from './types';
import { parseFormula } from './formulaParser';

const REACTION_ARROWS = [
  '<=>',
  '<->',
  '⇌',
  '-->',
  '->',
  '==>',
  '=>',
  '→',
  '='
];

/**
 * Faz o parsing de uma equação química textual.
 * Exemplos:
 *   "2 H2 + O2 -> 2 H2O"
 *   "Ca(OH)2 + 2 HCl -> CaCl2 + 2 H2O"
 *   "Fe + O2 = Fe2O3"
 */
export function parseEquation(rawInput: string): ParsedEquation {
  if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
    return {
      raw: rawInput || '',
      reactants: [],
      products: [],
      isReversible: false,
      isValid: false,
      error: 'Equação não pode estar vazia.'
    };
  }

  const trimmed = rawInput.trim();

  // Localiza o separador de reação (seta)
  let arrowFound = '';
  let splitIndex = -1;

  for (const arrow of REACTION_ARROWS) {
    const idx = trimmed.indexOf(arrow);
    if (idx !== -1) {
      arrowFound = arrow;
      splitIndex = idx;
      break;
    }
  }

  if (splitIndex === -1) {
    return {
      raw: trimmed,
      reactants: [],
      products: [],
      isReversible: false,
      isValid: false,
      error: 'Equação deve conter uma seta indicando a reação (ex: "->", "-->", "⇌" ou "=").'
    };
  }

  const isReversible = arrowFound === '<=>' || arrowFound === '<->' || arrowFound === '⇌';

  const leftSide = trimmed.slice(0, splitIndex).trim();
  const rightSide = trimmed.slice(splitIndex + arrowFound.length).trim();

  if (!leftSide) {
    return {
      raw: trimmed,
      reactants: [],
      products: [],
      isReversible,
      isValid: false,
      error: 'Nenhum reagente informado no lado esquerdo da equação.'
    };
  }

  if (!rightSide) {
    return {
      raw: trimmed,
      reactants: [],
      products: [],
      isReversible,
      isValid: false,
      error: 'Nenhum produto informado no lado direito da equação.'
    };
  }

  try {
    const reactants = parseParticipantList(leftSide);
    const products = parseParticipantList(rightSide);

    if (reactants.length === 0) {
      throw new Error('Equação precisa de pelo menos 1 reagente.');
    }
    if (products.length === 0) {
      throw new Error('Equação precisa de pelo menos 1 produto.');
    }

    return {
      raw: trimmed,
      reactants,
      products,
      isReversible,
      isValid: true
    };
  } catch (err: any) {
    return {
      raw: trimmed,
      reactants: [],
      products: [],
      isReversible,
      isValid: false,
      error: err?.message || 'Erro ao processar a equação química.'
    };
  }
}

/**
 * Divide uma lista de participantes separados por '+'
 * Ex: "2 H2 + O2" -> ["2 H2", "O2"]
 * Tratando com cuidado casos de íons como Fe2+ se estiver sem espaços
 */
function parseParticipantList(sideStr: string): SubstanceParticipant[] {
  // Split por '+' que não faça parte de um expoente de carga
  // Por exemplo, split em ' + ' ou '+' cercado por espaços ou limites
  const parts = splitPlusSigns(sideStr);

  return parts.map(part => {
    const clean = part.trim();
    if (!clean) {
      throw new Error('Participante vazio encontrado (verifique sinais de "+" duplicados).');
    }

    // Extrair coeficiente estequiométrico inicial (ex: "2 H2", "3Ca(OH)2", "4 Fe")
    const match = clean.match(/^(\d+)\s*(.+)$/);
    let coefficient = 1;
    let formulaStr = clean;

    if (match) {
      coefficient = parseInt(match[1], 10);
      formulaStr = match[2].trim();
    }

    const parsed = parseFormula(formulaStr);

    return {
      coefficient,
      formula: formulaStr,
      parsed,
      raw: clean
    };
  });
}

function splitPlusSigns(str: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inParen = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (ch === '(' || ch === '[' || ch === '{') {
      inParen++;
      current += ch;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      inParen = Math.max(0, inParen - 1);
      current += ch;
    } else if (ch === '+' && inParen === 0) {
      // Checa se é carga no final de uma fórmula (ex: Na+ ou Fe2+) sem espaço posterior
      const prevChar = i > 0 ? str[i - 1] : '';
      const nextChar = i < str.length - 1 ? str[i + 1] : '';

      // Se '+' estiver cercado por espaço ou no início/fim, é operador de soma
      const isSurroundedByWhitespace = /\s/.test(prevChar) || /\s/.test(nextChar);
      // Se o anterior for dígito ou letra mas seguido de espaço, ou se houver espaço antes
      if (isSurroundedByWhitespace || i === 0 || i === str.length - 1) {
        tokens.push(current);
        current = '';
        continue;
      }

      current += ch;
    } else {
      current += ch;
    }
  }

  if (current.trim()) {
    tokens.push(current);
  }

  return tokens.filter(t => t.trim().length > 0);
}
