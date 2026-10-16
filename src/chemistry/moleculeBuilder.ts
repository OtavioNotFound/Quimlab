import { getElement } from './periodicTable';

export type BondOrder = 1 | 2 | 3;

export interface MoleculeAtom {
  id: string;
  symbol: string;
  x: number;
  y: number;
}

export interface MoleculeBond {
  id: string;
  atomA: string;
  atomB: string;
  order: BondOrder;
}

export interface MoleculeTemplate {
  id: string;
  name: string;
  formula: string;
  atoms: Omit<MoleculeAtom, 'id'>[];
  bonds: Array<[number, number, BondOrder]>;
}

export interface MoleculeValidation {
  status: 'empty' | 'incomplete' | 'valid' | 'invalid' | 'disconnected';
  message: string;
  atomIssues: Record<string, string>;
}

export const BUILDER_ELEMENTS = ['H', 'C', 'N', 'O', 'F', 'P', 'S', 'Cl', 'Br', 'I', 'B', 'Si'] as const;

export const ELEMENT_COLORS: Record<string, string> = {
  H: '#f4f5ed',
  C: '#26322b',
  N: '#3d5f91',
  O: '#b94a32',
  F: '#69a66d',
  P: '#d1843c',
  S: '#d2aa35',
  Cl: '#5b9b61',
  Br: '#8f4b38',
  I: '#705c8d',
  B: '#bd8066',
  Si: '#8d8478'
};

export const TYPICAL_VALENCE: Record<string, number> = {
  H: 1,
  B: 3,
  C: 4,
  N: 3,
  O: 2,
  F: 1,
  Si: 4,
  P: 3,
  S: 2,
  Cl: 1,
  Br: 1,
  I: 1
};

export const MOLECULE_TEMPLATES: MoleculeTemplate[] = [
  template('water', 'Água', 'H2O', [
    ['O', 450, 250], ['H', 375, 315], ['H', 525, 315]
  ], [[0, 1, 1], [0, 2, 1]]),
  template('carbon-dioxide', 'Dióxido de carbono', 'CO2', [
    ['O', 330, 260], ['C', 450, 260], ['O', 570, 260]
  ], [[0, 1, 2], [1, 2, 2]]),
  template('methane', 'Metano', 'CH4', [
    ['C', 450, 255], ['H', 450, 140], ['H', 450, 370], ['H', 335, 255], ['H', 565, 255]
  ], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]),
  template('ammonia', 'Amônia', 'NH3', [
    ['N', 450, 240], ['H', 350, 315], ['H', 550, 315], ['H', 450, 120]
  ], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]),
  template('oxygen', 'Oxigênio', 'O2', [
    ['O', 390, 260], ['O', 510, 260]
  ], [[0, 1, 2]]),
  template('nitrogen', 'Nitrogênio', 'N2', [
    ['N', 390, 260], ['N', 510, 260]
  ], [[0, 1, 3]]),
  template('ethene', 'Eteno', 'C2H4', [
    ['C', 390, 260], ['C', 510, 260], ['H', 325, 180], ['H', 325, 340], ['H', 575, 180], ['H', 575, 340]
  ], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]),
  template('ethanol', 'Etanol', 'C2H6O', [
    ['C', 340, 260], ['C', 460, 260], ['O', 580, 260], ['H', 270, 190], ['H', 270, 330],
    ['H', 340, 370], ['H', 460, 155], ['H', 460, 365], ['H', 650, 260]
  ], [[0, 1, 1], [1, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1], [1, 6, 1], [1, 7, 1], [2, 8, 1]])
];

export function createMoleculeFromTemplate(templateDefinition: MoleculeTemplate): {
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
} {
  const atoms = templateDefinition.atoms.map((atom, index) => ({ ...atom, id: `atom-${index + 1}` }));
  const bonds = templateDefinition.bonds.map(([a, b, order], index) => ({
    id: `bond-${index + 1}`,
    atomA: atoms[a].id,
    atomB: atoms[b].id,
    order
  }));
  return { atoms, bonds };
}

export function calculateMolecularFormula(atoms: MoleculeAtom[]): string {
  const counts = atoms.reduce<Record<string, number>>((acc, atom) => {
    acc[atom.symbol] = (acc[atom.symbol] ?? 0) + 1;
    return acc;
  }, {});

  const symbols = Object.keys(counts);
  let order: string[];
  if (counts.C) {
    order = ['C', ...(counts.H ? ['H'] : []), ...symbols.filter(symbol => symbol !== 'C' && symbol !== 'H').sort()];
  } else if (symbols.length === 2 && counts.H) {
    const other = symbols.find(symbol => symbol !== 'H')!;
    order = ['N', 'P', 'B', 'Si'].includes(other) ? [other, 'H'] : ['H', other];
  } else {
    order = symbols.sort();
  }

  return order.map(symbol => `${symbol}${counts[symbol] > 1 ? counts[symbol] : ''}`).join('');
}

export function calculateMolecularMass(atoms: MoleculeAtom[]): number {
  return atoms.reduce((total, atom) => total + (getElement(atom.symbol)?.atomicMass ?? 0), 0);
}

export function getAtomBondOrder(atomId: string, bonds: MoleculeBond[]): number {
  return bonds.reduce((total, bond) => (
    bond.atomA === atomId || bond.atomB === atomId ? total + bond.order : total
  ), 0);
}

export function validateMolecule(atoms: MoleculeAtom[], bonds: MoleculeBond[]): MoleculeValidation {
  if (atoms.length === 0) {
    return { status: 'empty', message: 'Adicione um átomo para começar.', atomIssues: {} };
  }

  const atomIssues: Record<string, string> = {};
  let hasExceededValence = false;
  let hasIncompleteValence = false;

  for (const atom of atoms) {
    const expected = TYPICAL_VALENCE[atom.symbol];
    const actual = getAtomBondOrder(atom.id, bonds);
    if (actual > expected) {
      atomIssues[atom.id] = `${atom.symbol}: ${actual} ligações para valência típica ${expected}`;
      hasExceededValence = true;
    } else if (actual < expected) {
      atomIssues[atom.id] = `${atom.symbol}: faltam ${expected - actual} ligação(ões)`;
      hasIncompleteValence = true;
    }
  }

  if (hasExceededValence) {
    return { status: 'invalid', message: 'Há um átomo com mais ligações que sua valência típica.', atomIssues };
  }

  if (atoms.length > 1 && countConnectedComponents(atoms, bonds) > 1) {
    return { status: 'disconnected', message: 'Ainda existem grupos de átomos desconectados.', atomIssues };
  }

  if (hasIncompleteValence) {
    return { status: 'incomplete', message: 'A estrutura ainda possui valências disponíveis.', atomIssues };
  }

  return { status: 'valid', message: 'Estrutura conectada com as valências típicas completas.', atomIssues: {} };
}

export function completeWithHydrogens(
  atoms: MoleculeAtom[],
  bonds: MoleculeBond[]
): { atoms: MoleculeAtom[]; bonds: MoleculeBond[] } {
  const nextAtoms = [...atoms];
  const nextBonds = [...bonds];
  let atomCounter = nextIdNumber(nextAtoms.map(atom => atom.id), 'atom-');
  let bondCounter = nextIdNumber(nextBonds.map(bond => bond.id), 'bond-');

  for (const atom of atoms.filter(item => item.symbol !== 'H')) {
    const missing = Math.max(0, (TYPICAL_VALENCE[atom.symbol] ?? 0) - getAtomBondOrder(atom.id, nextBonds));
    const existingAngles = nextBonds
      .filter(bond => bond.atomA === atom.id || bond.atomB === atom.id)
      .map(bond => {
        const otherId = bond.atomA === atom.id ? bond.atomB : bond.atomA;
        const other = nextAtoms.find(item => item.id === otherId)!;
        return Math.atan2(other.y - atom.y, other.x - atom.x);
      });

    for (let index = 0; index < missing; index++) {
      const angle = findOpenAngle(existingAngles, index, missing);
      const hydrogen: MoleculeAtom = {
        id: `atom-${atomCounter++}`,
        symbol: 'H',
        x: clamp(atom.x + Math.cos(angle) * 92, 45, 855),
        y: clamp(atom.y + Math.sin(angle) * 92, 45, 475)
      };
      nextAtoms.push(hydrogen);
      nextBonds.push({ id: `bond-${bondCounter++}`, atomA: atom.id, atomB: hydrogen.id, order: 1 });
      existingAngles.push(angle);
    }
  }

  return { atoms: nextAtoms, bonds: nextBonds };
}

export function countConnectedComponents(atoms: MoleculeAtom[], bonds: MoleculeBond[]): number {
  if (atoms.length === 0) return 0;
  const adjacency = new Map(atoms.map(atom => [atom.id, [] as string[]]));
  bonds.forEach(bond => {
    adjacency.get(bond.atomA)?.push(bond.atomB);
    adjacency.get(bond.atomB)?.push(bond.atomA);
  });

  const visited = new Set<string>();
  let components = 0;
  for (const atom of atoms) {
    if (visited.has(atom.id)) continue;
    components++;
    const queue = [atom.id];
    while (queue.length) {
      const current = queue.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      adjacency.get(current)?.forEach(neighbor => queue.push(neighbor));
    }
  }
  return components;
}

function template(
  id: string,
  name: string,
  formula: string,
  atoms: Array<[string, number, number]>,
  bonds: Array<[number, number, BondOrder]>
): MoleculeTemplate {
  return { id, name, formula, atoms: atoms.map(([symbol, x, y]) => ({ symbol, x, y })), bonds };
}

function nextIdNumber(ids: string[], prefix: string): number {
  return Math.max(0, ...ids.map(id => Number(id.replace(prefix, '')) || 0)) + 1;
}

function findOpenAngle(existingAngles: number[], index: number, total: number): number {
  if (existingAngles.length === 0) return -Math.PI / 2 + (index * Math.PI * 2) / Math.max(total, 1);
  const candidates = Array.from({ length: 12 }, (_, candidate) => (candidate * Math.PI * 2) / 12);
  return candidates.reduce((best, candidate) => {
    const distance = Math.min(...existingAngles.map(angle => angularDistance(angle, candidate)));
    const bestDistance = Math.min(...existingAngles.map(angle => angularDistance(angle, best)));
    return distance > bestDistance ? candidate : best;
  }, candidates[index % candidates.length]);
}

function angularDistance(a: number, b: number): number {
  const difference = Math.abs(a - b) % (Math.PI * 2);
  return Math.min(difference, Math.PI * 2 - difference);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
