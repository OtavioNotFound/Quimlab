import { ElementData } from './types';

/**
 * Tabela periódica completa com os 118 elementos químicos,
 * massas atômicas padrão (IUPAC), coordenadas de período/grupo e nomes em português.
 */
export const PERIODIC_TABLE: Record<string, ElementData> = {
  H: { symbol: 'H', name: 'Hidrogênio', atomicNumber: 1, atomicMass: 1.008, category: 'nonmetal', period: 1, group: 1, electronegativity: 2.20, commonOxidationStates: [1, -1], electronConfiguration: '1s¹' },
  He: { symbol: 'He', name: 'Hélio', atomicNumber: 2, atomicMass: 4.0026, category: 'noble_gas', period: 1, group: 18, commonOxidationStates: [0], electronConfiguration: '1s²' },
  Li: { symbol: 'Li', name: 'Lítio', atomicNumber: 3, atomicMass: 6.94, category: 'alkali_metal', period: 2, group: 1, electronegativity: 0.98, commonOxidationStates: [1], electronConfiguration: '[He] 2s¹' },
  Be: { symbol: 'Be', name: 'Berílio', atomicNumber: 4, atomicMass: 9.0122, category: 'alkaline_earth_metal', period: 2, group: 2, electronegativity: 1.57, commonOxidationStates: [2], electronConfiguration: '[He] 2s²' },
  B: { symbol: 'B', name: 'Boro', atomicNumber: 5, atomicMass: 10.81, category: 'metalloid', period: 2, group: 13, electronegativity: 2.04, commonOxidationStates: [3], electronConfiguration: '[He] 2s² 2p¹' },
  C: { symbol: 'C', name: 'Carbono', atomicNumber: 6, atomicMass: 12.011, category: 'nonmetal', period: 2, group: 14, electronegativity: 2.55, commonOxidationStates: [4, 2, -4], electronConfiguration: '[He] 2s² 2p²' },
  N: { symbol: 'N', name: 'Nitrogênio', atomicNumber: 7, atomicMass: 14.007, category: 'nonmetal', period: 2, group: 15, electronegativity: 3.04, commonOxidationStates: [-3, 3, 5, 2, 4], electronConfiguration: '[He] 2s² 2p³' },
  O: { symbol: 'O', name: 'Oxigênio', atomicNumber: 8, atomicMass: 15.999, category: 'nonmetal', period: 2, group: 16, electronegativity: 3.44, commonOxidationStates: [-2, -1], electronConfiguration: '[He] 2s² 2p⁴' },
  F: { symbol: 'F', name: 'Flúor', atomicNumber: 9, atomicMass: 18.998, category: 'halogen', period: 2, group: 17, electronegativity: 3.98, commonOxidationStates: [-1], electronConfiguration: '[He] 2s² 2p⁵' },
  Ne: { symbol: 'Ne', name: 'Neônio', atomicNumber: 10, atomicMass: 20.180, category: 'noble_gas', period: 2, group: 18, commonOxidationStates: [0], electronConfiguration: '[He] 2s² 2p⁶' },
  Na: { symbol: 'Na', name: 'Sódio', atomicNumber: 11, atomicMass: 22.990, category: 'alkali_metal', period: 3, group: 1, electronegativity: 0.93, commonOxidationStates: [1], electronConfiguration: '[Ne] 3s¹' },
  Mg: { symbol: 'Mg', name: 'Magnésio', atomicNumber: 12, atomicMass: 24.305, category: 'alkaline_earth_metal', period: 3, group: 2, electronegativity: 1.31, commonOxidationStates: [2], electronConfiguration: '[Ne] 3s²' },
  Al: { symbol: 'Al', name: 'Alumínio', atomicNumber: 13, atomicMass: 26.982, category: 'post_transition_metal', period: 3, group: 13, electronegativity: 1.61, commonOxidationStates: [3], electronConfiguration: '[Ne] 3s² 3p¹' },
  Si: { symbol: 'Si', name: 'Silício', atomicNumber: 14, atomicMass: 28.085, category: 'metalloid', period: 3, group: 14, electronegativity: 1.90, commonOxidationStates: [4, -4], electronConfiguration: '[Ne] 3s² 3p²' },
  P: { symbol: 'P', name: 'Fósforo', atomicNumber: 15, atomicMass: 30.974, category: 'nonmetal', period: 3, group: 15, electronegativity: 2.19, commonOxidationStates: [5, 3, -3], electronConfiguration: '[Ne] 3s² 3p³' },
  S: { symbol: 'S', name: 'Enxofre', atomicNumber: 16, atomicMass: 32.06, category: 'nonmetal', period: 3, group: 16, electronegativity: 2.58, commonOxidationStates: [6, 4, -2], electronConfiguration: '[Ne] 3s² 3p⁴' },
  Cl: { symbol: 'Cl', name: 'Cloro', atomicNumber: 17, atomicMass: 35.45, category: 'halogen', period: 3, group: 17, electronegativity: 3.16, commonOxidationStates: [-1, 1, 3, 5, 7], electronConfiguration: '[Ne] 3s² 3p⁵' },
  Ar: { symbol: 'Ar', name: 'Argônio', atomicNumber: 18, atomicMass: 39.948, category: 'noble_gas', period: 3, group: 18, commonOxidationStates: [0], electronConfiguration: '[Ne] 3s² 3p⁶' },
  K: { symbol: 'K', name: 'Potássio', atomicNumber: 19, atomicMass: 39.098, category: 'alkali_metal', period: 4, group: 1, electronegativity: 0.82, commonOxidationStates: [1], electronConfiguration: '[Ar] 4s¹' },
  Ca: { symbol: 'Ca', name: 'Cálcio', atomicNumber: 20, atomicMass: 40.078, category: 'alkaline_earth_metal', period: 4, group: 2, electronegativity: 1.00, commonOxidationStates: [2], electronConfiguration: '[Ar] 4s²' },
  Sc: { symbol: 'Sc', name: 'Escândio', atomicNumber: 21, atomicMass: 44.956, category: 'transition_metal', period: 4, group: 3, electronegativity: 1.36, commonOxidationStates: [3], electronConfiguration: '[Ar] 3d¹ 4s²' },
  Ti: { symbol: 'Ti', name: 'Titânio', atomicNumber: 22, atomicMass: 47.867, category: 'transition_metal', period: 4, group: 4, electronegativity: 1.54, commonOxidationStates: [4, 3], electronConfiguration: '[Ar] 3d² 4s²' },
  V: { symbol: 'V', name: 'Vanádio', atomicNumber: 23, atomicMass: 50.942, category: 'transition_metal', period: 4, group: 5, electronegativity: 1.63, commonOxidationStates: [5, 4, 3, 2], electronConfiguration: '[Ar] 3d³ 4s²' },
  Cr: { symbol: 'Cr', name: 'Cromo', atomicNumber: 24, atomicMass: 51.996, category: 'transition_metal', period: 4, group: 6, electronegativity: 1.66, commonOxidationStates: [3, 6, 2], electronConfiguration: '[Ar] 3d⁵ 4s¹' },
  Mn: { symbol: 'Mn', name: 'Manganês', atomicNumber: 25, atomicMass: 54.938, category: 'transition_metal', period: 4, group: 7, electronegativity: 1.55, commonOxidationStates: [2, 4, 7], electronConfiguration: '[Ar] 3d⁵ 4s²' },
  Fe: { symbol: 'Fe', name: 'Ferro', atomicNumber: 26, atomicMass: 55.845, category: 'transition_metal', period: 4, group: 8, electronegativity: 1.83, commonOxidationStates: [2, 3], electronConfiguration: '[Ar] 3d⁶ 4s²' },
  Co: { symbol: 'Co', name: 'Cobalto', atomicNumber: 27, atomicMass: 58.933, category: 'transition_metal', period: 4, group: 9, electronegativity: 1.88, commonOxidationStates: [2, 3], electronConfiguration: '[Ar] 3d⁷ 4s²' },
  Ni: { symbol: 'Ni', name: 'Níquel', atomicNumber: 28, atomicMass: 58.693, category: 'transition_metal', period: 4, group: 10, electronegativity: 1.91, commonOxidationStates: [2, 3], electronConfiguration: '[Ar] 3d⁸ 4s²' },
  Cu: { symbol: 'Cu', name: 'Cobre', atomicNumber: 29, atomicMass: 63.546, category: 'transition_metal', period: 4, group: 11, electronegativity: 1.90, commonOxidationStates: [2, 1], electronConfiguration: '[Ar] 3d¹⁰ 4s¹' },
  Zn: { symbol: 'Zn', name: 'Zinco', atomicNumber: 30, atomicMass: 65.38, category: 'transition_metal', period: 4, group: 12, electronegativity: 1.65, commonOxidationStates: [2], electronConfiguration: '[Ar] 3d¹⁰ 4s²' },
  Ga: { symbol: 'Ga', name: 'Gálio', atomicNumber: 31, atomicMass: 69.723, category: 'post_transition_metal', period: 4, group: 13, electronegativity: 1.81, commonOxidationStates: [3], electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹' },
  Ge: { symbol: 'Ge', name: 'Germânio', atomicNumber: 32, atomicMass: 72.630, category: 'metalloid', period: 4, group: 14, electronegativity: 2.01, commonOxidationStates: [4, 2], electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²' },
  As: { symbol: 'As', name: 'Arsênio', atomicNumber: 33, atomicMass: 74.922, category: 'metalloid', period: 4, group: 15, electronegativity: 2.18, commonOxidationStates: [3, 5, -3], electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³' },
  Se: { symbol: 'Se', name: 'Selênio', atomicNumber: 34, atomicMass: 78.971, category: 'nonmetal', period: 4, group: 16, electronegativity: 2.55, commonOxidationStates: [-2, 4, 6], electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴' },
  Br: { symbol: 'Br', name: 'Bromo', atomicNumber: 35, atomicMass: 79.904, category: 'halogen', period: 4, group: 17, electronegativity: 2.96, commonOxidationStates: [-1, 1, 5], electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵' },
  Kr: { symbol: 'Kr', name: 'Criptônio', atomicNumber: 36, atomicMass: 83.798, category: 'noble_gas', period: 4, group: 18, commonOxidationStates: [0], electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶' },
  Rb: { symbol: 'Rb', name: 'Rubídio', atomicNumber: 37, atomicMass: 85.468, category: 'alkali_metal', period: 5, group: 1, electronegativity: 0.82, commonOxidationStates: [1], electronConfiguration: '[Kr] 5s¹' },
  Sr: { symbol: 'Sr', name: 'Estrôncio', atomicNumber: 38, atomicMass: 87.62, category: 'alkaline_earth_metal', period: 5, group: 2, electronegativity: 0.95, commonOxidationStates: [2], electronConfiguration: '[Kr] 5s²' },
  Y: { symbol: 'Y', name: 'Ítrio', atomicNumber: 39, atomicMass: 88.906, category: 'transition_metal', period: 5, group: 3, electronegativity: 1.22, commonOxidationStates: [3], electronConfiguration: '[Kr] 4d¹ 5s²' },
  Zr: { symbol: 'Zr', name: 'Zircônio', atomicNumber: 40, atomicMass: 91.224, category: 'transition_metal', period: 5, group: 4, electronegativity: 1.33, commonOxidationStates: [4], electronConfiguration: '[Kr] 4d² 5s²' },
  Nb: { symbol: 'Nb', name: 'Nióbio', atomicNumber: 41, atomicMass: 92.906, category: 'transition_metal', period: 5, group: 5, electronegativity: 1.6, commonOxidationStates: [5, 3], electronConfiguration: '[Kr] 4d⁴ 5s¹' },
  Mo: { symbol: 'Mo', name: 'Molibdênio', atomicNumber: 42, atomicMass: 95.95, category: 'transition_metal', period: 5, group: 6, electronegativity: 2.16, commonOxidationStates: [6, 4], electronConfiguration: '[Kr] 4d⁵ 5s¹' },
  Tc: { symbol: 'Tc', name: 'Tecnécio', atomicNumber: 43, atomicMass: 98, category: 'transition_metal', period: 5, group: 7, electronegativity: 1.9, commonOxidationStates: [7, 4], electronConfiguration: '[Kr] 4d⁵ 5s²' },
  Ru: { symbol: 'Ru', name: 'Rutênio', atomicNumber: 44, atomicMass: 101.07, category: 'transition_metal', period: 5, group: 8, electronegativity: 2.2, commonOxidationStates: [3, 4], electronConfiguration: '[Kr] 4d⁷ 5s¹' },
  Rh: { symbol: 'Rh', name: 'Ródio', atomicNumber: 45, atomicMass: 102.91, category: 'transition_metal', period: 5, group: 9, electronegativity: 2.28, commonOxidationStates: [3], electronConfiguration: '[Kr] 4d⁸ 5s¹' },
  Pd: { symbol: 'Pd', name: 'Paládio', atomicNumber: 46, atomicMass: 106.42, category: 'transition_metal', period: 5, group: 10, electronegativity: 2.20, commonOxidationStates: [2, 4], electronConfiguration: '[Kr] 4d¹⁰' },
  Ag: { symbol: 'Ag', name: 'Prata', atomicNumber: 47, atomicMass: 107.87, category: 'transition_metal', period: 5, group: 11, electronegativity: 1.93, commonOxidationStates: [1], electronConfiguration: '[Kr] 4d¹⁰ 5s¹' },
  Cd: { symbol: 'Cd', name: 'Cádmio', atomicNumber: 48, atomicMass: 112.41, category: 'transition_metal', period: 5, group: 12, electronegativity: 1.69, commonOxidationStates: [2], electronConfiguration: '[Kr] 4d¹⁰ 5s²' },
  In: { symbol: 'In', name: 'Índio', atomicNumber: 49, atomicMass: 114.82, category: 'post_transition_metal', period: 5, group: 13, electronegativity: 1.78, commonOxidationStates: [3], electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹' },
  Sn: { symbol: 'Sn', name: 'Estanho', atomicNumber: 50, atomicMass: 118.71, category: 'post_transition_metal', period: 5, group: 14, electronegativity: 1.96, commonOxidationStates: [4, 2], electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²' },
  Sb: { symbol: 'Sb', name: 'Antimônio', atomicNumber: 51, atomicMass: 121.76, category: 'metalloid', period: 5, group: 15, electronegativity: 2.05, commonOxidationStates: [3, 5], electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³' },
  Te: { symbol: 'Te', name: 'Telúrio', atomicNumber: 52, atomicMass: 127.60, category: 'metalloid', period: 5, group: 16, electronegativity: 2.1, commonOxidationStates: [4, 6, -2], electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴' },
  I: { symbol: 'I', name: 'Iodo', atomicNumber: 53, atomicMass: 126.90, category: 'halogen', period: 5, group: 17, electronegativity: 2.66, commonOxidationStates: [-1, 1, 5, 7], electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵' },
  Xe: { symbol: 'Xe', name: 'Xenônio', atomicNumber: 54, atomicMass: 131.29, category: 'noble_gas', period: 5, group: 18, commonOxidationStates: [0], electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶' },
  Cs: { symbol: 'Cs', name: 'Césio', atomicNumber: 55, atomicMass: 132.91, category: 'alkali_metal', period: 6, group: 1, electronegativity: 0.79, commonOxidationStates: [1], electronConfiguration: '[Xe] 6s¹' },
  Ba: { symbol: 'Ba', name: 'Bário', atomicNumber: 56, atomicMass: 137.33, category: 'alkaline_earth_metal', period: 6, group: 2, electronegativity: 0.89, commonOxidationStates: [2], electronConfiguration: '[Xe] 6s²' },
  La: { symbol: 'La', name: 'Lantânio', atomicNumber: 57, atomicMass: 138.91, category: 'lanthanide', period: 6, group: 3, electronegativity: 1.1, commonOxidationStates: [3], electronConfiguration: '[Xe] 5d¹ 6s²' },
  Ce: { symbol: 'Ce', name: 'Cério', atomicNumber: 58, atomicMass: 140.12, category: 'lanthanide', period: 6, group: 3, electronegativity: 1.12, commonOxidationStates: [3, 4], electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²' },
  W: { symbol: 'W', name: 'Tungstênio', atomicNumber: 74, atomicMass: 183.84, category: 'transition_metal', period: 6, group: 6, electronegativity: 2.36, commonOxidationStates: [6, 4], electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²' },
  Pt: { symbol: 'Pt', name: 'Platina', atomicNumber: 78, atomicMass: 195.08, category: 'transition_metal', period: 6, group: 10, electronegativity: 2.28, commonOxidationStates: [2, 4], electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹' },
  Au: { symbol: 'Au', name: 'Ouro', atomicNumber: 79, atomicMass: 196.97, category: 'transition_metal', period: 6, group: 11, electronegativity: 2.54, commonOxidationStates: [3, 1], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
  Hg: { symbol: 'Hg', name: 'Mercúrio', atomicNumber: 80, atomicMass: 200.59, category: 'transition_metal', period: 6, group: 12, electronegativity: 2.00, commonOxidationStates: [2, 1], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²' },
  Tl: { symbol: 'Tl', name: 'Tálio', atomicNumber: 81, atomicMass: 204.38, category: 'post_transition_metal', period: 6, group: 13, electronegativity: 1.62, commonOxidationStates: [1, 3], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹' },
  Pb: { symbol: 'Pb', name: 'Chumbo', atomicNumber: 82, atomicMass: 207.2, category: 'post_transition_metal', period: 6, group: 14, electronegativity: 2.33, commonOxidationStates: [2, 4], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²' },
  Bi: { symbol: 'Bi', name: 'Bismuto', atomicNumber: 83, atomicMass: 208.98, category: 'post_transition_metal', period: 6, group: 15, electronegativity: 2.02, commonOxidationStates: [3], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³' },
  Po: { symbol: 'Po', name: 'Polônio', atomicNumber: 84, atomicMass: 209, category: 'post_transition_metal', period: 6, group: 16, electronegativity: 2.0, commonOxidationStates: [4, 2], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴' },
  At: { symbol: 'At', name: 'Ástato', atomicNumber: 85, atomicMass: 210, category: 'halogen', period: 6, group: 17, electronegativity: 2.2, commonOxidationStates: [-1, 1], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵' },
  Rn: { symbol: 'Rn', name: 'Radônio', atomicNumber: 86, atomicMass: 222, category: 'noble_gas', period: 6, group: 18, commonOxidationStates: [0], electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶' },
  Fr: { symbol: 'Fr', name: 'Frâncio', atomicNumber: 87, atomicMass: 223, category: 'alkali_metal', period: 7, group: 1, electronegativity: 0.7, commonOxidationStates: [1], electronConfiguration: '[Rn] 7s¹' },
  Ra: { symbol: 'Ra', name: 'Rádio', atomicNumber: 88, atomicMass: 226, category: 'alkaline_earth_metal', period: 7, group: 2, electronegativity: 0.9, commonOxidationStates: [2], electronConfiguration: '[Rn] 7s²' },
  Ac: { symbol: 'Ac', name: 'Actínio', atomicNumber: 89, atomicMass: 227, category: 'actinide', period: 7, group: 3, electronegativity: 1.1, commonOxidationStates: [3], electronConfiguration: '[Rn] 6d¹ 7s²' },
  Th: { symbol: 'Th', name: 'Tório', atomicNumber: 90, atomicMass: 232.04, category: 'actinide', period: 7, group: 3, electronegativity: 1.3, commonOxidationStates: [4], electronConfiguration: '[Rn] 6d² 7s²' },
  U: { symbol: 'U', name: 'Urânio', atomicNumber: 92, atomicMass: 238.03, category: 'actinide', period: 7, group: 3, electronegativity: 1.38, commonOxidationStates: [6, 4], electronConfiguration: '[Rn] 5f³ 6d¹ 7s²' }
};

export function getElement(symbol: string): ElementData | undefined {
  return PERIODIC_TABLE[symbol];
}

export function isValidElement(symbol: string): boolean {
  return symbol in PERIODIC_TABLE;
}

export function getAllElements(): ElementData[] {
  return Object.values(PERIODIC_TABLE).sort((a, b) => a.atomicNumber - b.atomicNumber);
}
