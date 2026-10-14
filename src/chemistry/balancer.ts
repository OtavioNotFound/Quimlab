import { BalanceResult, ParsedEquation, SubstanceParticipant } from './types';
import { parseEquation } from './equationParser';
import { buildAtomTable } from './atomCounter';

/**
 * Classe para aritmética exata de números racionais (frações) usando BigInt.
 * Garante que o balanceamento seja 100% exato sem erros de ponto flutuante.
 */
export class Fraction {
  num: bigint;
  den: bigint;

  constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
    let n = BigInt(numerator);
    let d = BigInt(denominator);

    if (d === 0n) {
      throw new Error('Divisão por zero em fração.');
    }

    if (d < 0n) {
      n = -n;
      d = -d;
    }

    const g = Fraction.gcd(Fraction.abs(n), d);
    this.num = n / g;
    this.den = d / g;
  }

  static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  static lcm(a: bigint, b: bigint): bigint {
    if (a === 0n || b === 0n) return 0n;
    return (Fraction.abs(a) * Fraction.abs(b)) / Fraction.gcd(Fraction.abs(a), Fraction.abs(b));
  }

  static abs(a: bigint): bigint {
    return a < 0n ? -a : a;
  }

  add(other: Fraction): Fraction {
    return new Fraction(
      this.num * other.den + other.num * this.den,
      this.den * other.den
    );
  }

  sub(other: Fraction): Fraction {
    return new Fraction(
      this.num * other.den - other.num * this.den,
      this.den * other.den
    );
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other: Fraction): Fraction {
    if (other.num === 0n) throw new Error('Divisão por zero.');
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  isZero(): boolean {
    return this.num === 0n;
  }

  isPositive(): boolean {
    return this.num > 0n;
  }

  isNegative(): boolean {
    return this.num < 0n;
  }

  negate(): Fraction {
    return new Fraction(-this.num, this.den);
  }

  toNumber(): number {
    return Number(this.num) / Number(this.den);
  }
}

/**
 * Balanceia automaticamente uma equação química pelo método algébrico de eliminação gaussiana exata.
 */
export function balanceEquation(input: string | ParsedEquation): BalanceResult {
  const parsed = typeof input === 'string' ? parseEquation(input) : input;

  if (!parsed.isValid) {
    return {
      success: false,
      error: parsed.error || 'Equação inválida.'
    };
  }

  const reactants = parsed.reactants;
  const products = parsed.products;
  const numReactants = reactants.length;
  const numProducts = products.length;
  const totalSubstances = numReactants + numProducts;

  // 1. Verificar elementos ausentes
  const initialCheck = buildAtomTable(reactants, products);
  if (initialCheck.missingInReactants.length > 0) {
    return {
      success: false,
      error: `Elemento(s) [${initialCheck.missingInReactants.join(', ')}] presente(s) nos produtos mas ausente(s) nos reagentes (violação da conservação da matéria).`
    };
  }
  if (initialCheck.missingInProducts.length > 0) {
    return {
      success: false,
      error: `Elemento(s) [${initialCheck.missingInProducts.join(', ')}] presente(s) nos reagentes mas ausente(s) nos produtos (violação da conservação da matéria).`
    };
  }

  // 2. Construir lista de restrições (elementos e cargas)
  const allElements = Array.from(
    new Set([
      ...reactants.flatMap(r => Object.keys(r.parsed.elements)),
      ...products.flatMap(p => Object.keys(p.parsed.elements))
    ])
  ).sort();

  // Verifica se há alguma carga iônica
  const hasCharges = [...reactants, ...products].some(p => p.parsed.charge !== undefined && p.parsed.charge !== 0);

  // Linhas da matriz: elementos (+ carga se houver)
  const numRows = allElements.length + (hasCharges ? 1 : 0);
  const matrix: Fraction[][] = [];

  // Preenche linhas para cada elemento
  for (let r = 0; r < allElements.length; r++) {
    const elem = allElements[r];
    const row: Fraction[] = [];

    // Reagentes (+ contagem)
    for (let i = 0; i < numReactants; i++) {
      const count = reactants[i].parsed.elements[elem] || 0;
      row.push(new Fraction(count));
    }

    // Produtos (- contagem)
    for (let j = 0; j < numProducts; j++) {
      const count = products[j].parsed.elements[elem] || 0;
      row.push(new Fraction(-count));
    }

    matrix.push(row);
  }

  // Se houver cargas, adiciona linha de conservação de carga
  if (hasCharges) {
    const chargeRow: Fraction[] = [];
    for (let i = 0; i < numReactants; i++) {
      chargeRow.push(new Fraction(reactants[i].parsed.charge || 0));
    }
    for (let j = 0; j < numProducts; j++) {
      chargeRow.push(new Fraction(-(products[j].parsed.charge || 0)));
    }
    matrix.push(chargeRow);
  }

  // 3. Eliminação Gaussiana em Racional Exato para encontrar a Forma Escalonada Reduzida (RREF)
  const rref = computeRREF(matrix, numRows, totalSubstances);

  // 4. Identificar colunas pivô e variáveis livres
  const pivotColumns: number[] = [];
  let currentRow = 0;

  for (let c = 0; c < totalSubstances && currentRow < numRows; c++) {
    if (!rref[currentRow][c].isZero()) {
      pivotColumns.push(c);
      currentRow++;
    }
  }

  const freeColumns: number[] = [];
  for (let c = 0; c < totalSubstances; c++) {
    if (!pivotColumns.includes(c)) {
      freeColumns.push(c);
    }
  }

  if (freeColumns.length === 0) {
    return {
      success: false,
      error: 'Não existe combinação estequiométrica válida para as substâncias informadas.'
    };
  }

  // 5. Encontrar solução inteira positiva minimal
  const solution = findPositiveIntegerSolution(rref, pivotColumns, freeColumns, totalSubstances);

  if (!solution) {
    return {
      success: false,
      error: 'A equação química fornecida não pode ser balanceada com coeficientes estequiométricos positivos consistentes.'
    };
  }

  const reactantCoeffs = solution.slice(0, numReactants);
  const productCoeffs = solution.slice(numReactants);

  // 6. Atualizar participantes com novos coeficientes
  const updatedReactants: SubstanceParticipant[] = reactants.map((r, i) => ({
    ...r,
    coefficient: reactantCoeffs[i]
  }));

  const updatedProducts: SubstanceParticipant[] = products.map((p, j) => ({
    ...p,
    coefficient: productCoeffs[j]
  }));

  // 7. Montar equação balanceada como string
  const formatSide = (parts: SubstanceParticipant[]) =>
    parts
      .map(p => (p.coefficient === 1 ? p.formula : `${p.coefficient} ${p.formula}`))
      .join(' + ');

  const arrow = parsed.isReversible ? '⇌' : '→';
  const balancedEquation = `${formatSide(updatedReactants)} ${arrow} ${formatSide(updatedProducts)}`;

  // 8. Tabela de contagem final
  const finalCheck = buildAtomTable(updatedReactants, updatedProducts, reactantCoeffs, productCoeffs);

  return {
    success: true,
    balancedEquation,
    reactantsCoefficients: reactantCoeffs,
    productsCoefficients: productCoeffs,
    reactants: updatedReactants,
    products: updatedProducts,
    atomTable: finalCheck.table,
    isConserved: finalCheck.isBalanced,
    explanation: generateBalanceExplanation(updatedReactants, updatedProducts, finalCheck.table)
  };
}

/**
 * Calcula a Forma Escalonada Reduzida (RREF) de uma matriz de Frações.
 */
function computeRREF(matrix: Fraction[][], rows: number, cols: number): Fraction[][] {
  const m = matrix.map(row => row.map(f => new Fraction(f.num, f.den)));
  let lead = 0;

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;

    let i = r;
    while (m[i][lead].isZero()) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) return m;
      }
    }

    // Trocar linha r com linha i
    const temp = m[r];
    m[r] = m[i];
    m[i] = temp;

    // Normalizar linha r dividindo pelo pivô
    const pivot = m[r][lead];
    for (let c = 0; c < cols; c++) {
      m[r][c] = m[r][c].div(pivot);
    }

    // Zerar coluna do pivô nas outras linhas
    for (let otherRow = 0; otherRow < rows; otherRow++) {
      if (otherRow !== r) {
        const factor = m[otherRow][lead];
        if (!factor.isZero()) {
          for (let c = 0; c < cols; c++) {
            m[otherRow][c] = m[otherRow][c].sub(factor.mul(m[r][c]));
          }
        }
      }
    }

    lead++;
  }

  return m;
}

/**
 * Encontra coeficientes inteiros positivos para as variáveis livres e pivôs.
 */
function findPositiveIntegerSolution(
  rref: Fraction[][],
  pivotCols: number[],
  freeCols: number[],
  _totalVars?: number
): number[] | null {
  // Se houver 1 variável livre (caso mais comum em reações químicas bem-definidas)
  if (freeCols.length === 1) {
    const candidate = solveForFreeAssignment(rref, pivotCols, freeCols, [new Fraction(1)]);
    if (candidate) return candidate;

    // Tenta -1 caso sinais tenham se invertido
    const candidateNeg = solveForFreeAssignment(rref, pivotCols, freeCols, [new Fraction(-1)]);
    if (candidateNeg) return candidateNeg;
  } else {
    // Se houver múltiplas variáveis livres (reações compostas ou independentes simultâneas)
    // Busca em uma grade pequena de inteiros positivos mínimos para as variáveis livres
    const maxSearch = freeCols.length === 2 ? 15 : 6;
    for (let s = 1; s <= maxSearch * freeCols.length; s++) {
      for (let v1 = 1; v1 <= Math.min(s, maxSearch); v1++) {
        if (freeCols.length === 2) {
          const v2 = s - v1;
          if (v2 >= 1 && v2 <= maxSearch) {
            const sol = solveForFreeAssignment(rref, pivotCols, freeCols, [new Fraction(v1), new Fraction(v2)]);
            if (sol) return sol;
          }
        } else if (freeCols.length === 3) {
          for (let v2 = 1; v2 <= maxSearch; v2++) {
            const v3 = s - v1 - v2;
            if (v3 >= 1 && v3 <= maxSearch) {
              const sol = solveForFreeAssignment(rref, pivotCols, freeCols, [
                new Fraction(v1),
                new Fraction(v2),
                new Fraction(v3)
              ]);
              if (sol) return sol;
            }
          }
        }
      }
    }
  }

  return null;
}

function solveForFreeAssignment(
  rref: Fraction[][],
  pivotCols: number[],
  freeCols: number[],
  freeValues: Fraction[]
): number[] | null {
  const values: Fraction[] = new Array(rref[0].length).fill(new Fraction(0));

  for (let i = 0; i < freeCols.length; i++) {
    values[freeCols[i]] = freeValues[i];
  }

  // Calcula valores dos pivôs: pivot_r = - sum_{free} (rref[r][free] * value[free])
  for (let r = 0; r < pivotCols.length; r++) {
    const pCol = pivotCols[r];
    let sum = new Fraction(0);
    for (let f = 0; f < freeCols.length; f++) {
      const freeCol = freeCols[f];
      sum = sum.add(rref[r][freeCol].mul(values[freeCol]));
    }
    values[pCol] = sum.negate();
  }

  // Checa se todos têm o mesmo sinal não-zero
  const allPos = values.every(v => v.isPositive());
  const allNeg = values.every(v => v.isNegative());

  if (!allPos && !allNeg) {
    return null;
  }

  if (allNeg) {
    for (let i = 0; i < values.length; i++) {
      values[i] = values[i].negate();
    }
  }

  // Encontra MMC de todos os denominadores
  let commonDen = 1n;
  for (const v of values) {
    commonDen = Fraction.lcm(commonDen, v.den);
  }

  // Multiplica para obter inteiros
  const intValues = values.map(v => (v.num * (commonDen / v.den)));

  // Divide pelo MDC de todos os inteiros
  let overallGcd = intValues[0];
  for (let i = 1; i < intValues.length; i++) {
    overallGcd = Fraction.gcd(overallGcd, intValues[i]);
  }

  return intValues.map(iv => Number(iv / overallGcd));
}

function generateBalanceExplanation(
  reactants: SubstanceParticipant[],
  products: SubstanceParticipant[],
  atomTable: { element: string; name: string; reactantsCount: number; productsCount: number }[]
): string {
  const rNames = reactants.map(r => r.parsed.cleanFormula).join(' + ');
  const pNames = products.map(p => p.parsed.cleanFormula).join(' + ');
  const atomList = atomTable.map(row => `${row.name} (${row.element}): ${row.reactantsCount} de cada lado`).join('; ');
  return `A reação entre ${rNames} para formar ${pNames} foi balanceada com sucesso conservando a massa e o número de átomos de todos os elementos: ${atomList}.`;
}
