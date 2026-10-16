import { describe, expect, it } from 'vitest';
import {
  calculateMolecularFormula,
  calculateMolecularMass,
  completeWithHydrogens,
  createMoleculeFromTemplate,
  MOLECULE_TEMPLATES,
  MoleculeAtom,
  validateMolecule
} from '../moleculeBuilder';

describe('Molecule Builder', () => {
  it('gera fórmula no sistema de Hill e calcula a massa molecular', () => {
    const atoms: MoleculeAtom[] = [
      atom('1', 'H'), atom('2', 'O'), atom('3', 'C'), atom('4', 'H'), atom('5', 'H'), atom('6', 'H')
    ];

    expect(calculateMolecularFormula(atoms)).toBe('CH4O');
    expect(calculateMolecularMass(atoms)).toBeCloseTo(32.04, 1);
  });

  it('mantém todos os modelos prontos conectados e com valências completas', () => {
    for (const template of MOLECULE_TEMPLATES) {
      const molecule = createMoleculeFromTemplate(template);
      expect(calculateMolecularFormula(molecule.atoms), template.name).toBe(template.formula);
      expect(validateMolecule(molecule.atoms, molecule.bonds), template.name).toMatchObject({ status: 'valid' });
    }
  });

  it('completa automaticamente as valências do carbono com hidrogênios', () => {
    const carbon = atom('atom-1', 'C', 450, 250);
    const completed = completeWithHydrogens([carbon], []);

    expect(calculateMolecularFormula(completed.atoms)).toBe('CH4');
    expect(completed.bonds).toHaveLength(4);
    expect(validateMolecule(completed.atoms, completed.bonds).status).toBe('valid');
  });

  it('sinaliza estruturas desconectadas e valências excedidas', () => {
    const atoms = [atom('atom-1', 'H'), atom('atom-2', 'H')];
    expect(validateMolecule(atoms, []).status).toBe('disconnected');

    const bonds = [
      { id: 'bond-1', atomA: 'atom-1', atomB: 'atom-2', order: 2 as const }
    ];
    expect(validateMolecule(atoms, bonds).status).toBe('invalid');
  });
});

function atom(id: string, symbol: string, x = 0, y = 0): MoleculeAtom {
  return { id, symbol, x, y };
}
