import { describe, it, expect } from 'vitest';
import { checkCompoundSolubility, isMoreReactiveMetal } from '../solubility';

describe('QuimLab Chemical Rules: Solubility and Reactivity', () => {
  describe('Solubility Rules', () => {
    it('deve identificar nitratos e acetatos como sempre solúveis', () => {
      expect(checkCompoundSolubility('AgNO3').isSoluble).toBe(true);
      expect(checkCompoundSolubility('Pb(NO3)2').isSoluble).toBe(true);
      expect(checkCompoundSolubility('Ca(CH3COO)2').isSoluble).toBe(true);
    });

    it('deve identificar compostos de metais alcalinos e amônio como solúveis', () => {
      expect(checkCompoundSolubility('NaCl').isSoluble).toBe(true);
      expect(checkCompoundSolubility('K2SO4').isSoluble).toBe(true);
      expect(checkCompoundSolubility('(NH4)2CO3').isSoluble).toBe(true);
    });

    it('deve identificar precipitados de haletos (AgCl, PbCl2)', () => {
      const agcl = checkCompoundSolubility('AgCl');
      expect(agcl.isSoluble).toBe(false);
      expect(agcl.status).toBe('insoluble');

      const pbcl2 = checkCompoundSolubility('PbCl2');
      expect(pbcl2.isSoluble).toBe(false);
    });

    it('deve identificar sulfatos insolúveis (BaSO4, PbSO4) e moderadamente solúveis (CaSO4)', () => {
      const baso4 = checkCompoundSolubility('BaSO4');
      expect(baso4.isSoluble).toBe(false);
      expect(baso4.status).toBe('insoluble');

      const caso4 = checkCompoundSolubility('CaSO4');
      expect(caso4.isSoluble).toBe(false);
      expect(caso4.status).toBe('slightly_soluble');
    });

    it('deve identificar hidróxidos insolúveis como Fe(OH)3 e Cu(OH)2', () => {
      expect(checkCompoundSolubility('Fe(OH)3').isSoluble).toBe(false);
      expect(checkCompoundSolubility('Cu(OH)2').isSoluble).toBe(false);
      // Ba(OH)2 é base solúvel
      expect(checkCompoundSolubility('Ba(OH)2').isSoluble).toBe(true);
    });

    it('deve identificar carbonatos insolúveis como CaCO3', () => {
      expect(checkCompoundSolubility('CaCO3').isSoluble).toBe(false);
    });
  });

  describe('Metal Reactivity Series', () => {
    it('deve prever corretamente que Zn desloca Cu', () => {
      expect(isMoreReactiveMetal('Zn', 'Cu')).toBe(true);
    });

    it('deve prever que Cu não desloca H (não reage com HCl para liberar H2)', () => {
      expect(isMoreReactiveMetal('Cu', 'H')).toBe(false);
    });

    it('deve prever que Fe desloca Cu em CuSO4', () => {
      expect(isMoreReactiveMetal('Fe', 'Cu')).toBe(true);
    });

    it('deve prever que Na é mais reativo que Mg e Fe', () => {
      expect(isMoreReactiveMetal('Na', 'Mg')).toBe(true);
      expect(isMoreReactiveMetal('Na', 'Fe')).toBe(true);
    });
  });
});
