/**
 * Regras de solubilidade em água e série de reatividade para previsão de reações químicas.
 * Este módulo complementa o classificador de reações e fornece suporte a reações de precipitação
 * e simples troca (deslocamento).
 */

export interface SolubilityCheckResult {
  isSoluble: boolean;
  status: 'soluble' | 'insoluble' | 'slightly_soluble';
  ruleExplanation: string;
}

/**
 * Fila de reatividade decrescente dos metais.
 * Um metal de maior reatividade desloca um cátion de menor reatividade.
 */
export const METAL_REACTIVITY_SERIES: string[] = [
  'Li', 'K', 'Ba', 'Sr', 'Ca', 'Na', // Muito reativos (metais alcalinos e alcalino-terrosos pesados)
  'Mg', 'Al', 'Mn', 'Zn', 'Cr', 'Fe', 'Cd', 'Co', 'Ni', 'Sn', 'Pb', // Reatividade moderada
  'H', // Referência padrão
  'Cu', 'Hg', 'Ag', 'Pt', 'Au' // Metais nobres (baixa reatividade)
];

/**
 * Fila de reatividade decrescente dos ametais: F > O > N > Cl > Br > I > S > C > P > H
 */
export const NONMETAL_REACTIVITY_SERIES: string[] = [
  'F', 'O', 'Cl', 'Br', 'I', 'S', 'C', 'P'
];

/**
 * Compara a reatividade relativa entre dois metais.
 * Retorna true se metalA for mais reativo que metalB.
 */
export function isMoreReactiveMetal(metalA: string, metalB: string): boolean | null {
  const idxA = METAL_REACTIVITY_SERIES.indexOf(metalA);
  const idxB = METAL_REACTIVITY_SERIES.indexOf(metalB);

  if (idxA === -1 || idxB === -1) return null;
  return idxA < idxB; // Menor índice significa maior reatividade na série
}

/**
 * Analisa a solubilidade em água de um composto inorgânico a 25 °C.
 * Baseado nas regras padronizadas de solubilidade da IUPAC e química geral.
 */
export function checkCompoundSolubility(formula: string): SolubilityCheckResult {
  const clean = formula.trim();

  // 1. Nitratos (NO3), Acetatos (CH3COO), Cloratos (ClO3) são sempre solúveis
  if (clean.includes('NO3') || clean.includes('CH3COO') || clean.includes('ClO3')) {
    return {
      isSoluble: true,
      status: 'soluble',
      ruleExplanation: 'Todos os nitratos, acetatos e cloratos são solúveis em água.'
    };
  }

  // 2. Compostos de metais alcalinos (Li, Na, K, Rb, Cs) e amônio (NH4) são quase sempre solúveis
  if (/^(Li|Na|K|Rb|Cs|NH4)/.test(clean) || clean.includes('(NH4)')) {
    return {
      isSoluble: true,
      status: 'soluble',
      ruleExplanation: 'Compostos de metais alcalinos (família 1A) e amônio são universalmente solúveis.'
    };
  }

  // 3. Cloretos (Cl), Brometos (Br) e Iodetos (I)
  if (clean.endsWith('Cl') || clean.endsWith('Cl2') || clean.endsWith('Cl3') ||
      clean.endsWith('Br') || clean.endsWith('Br2') || clean.endsWith('Br3') ||
      clean.endsWith('I') || clean.endsWith('I2')) {
    if (clean.startsWith('Ag') || clean.startsWith('Pb') || clean.startsWith('Hg')) {
      return {
        isSoluble: false,
        status: 'insoluble',
        ruleExplanation: 'Haletos (Cl⁻, Br⁻, I⁻) de prata (Ag⁺), chumbo (Pb²⁺) e mercúrio (Hg₂²⁺) são insolúveis.'
      };
    }
    return {
      isSoluble: true,
      status: 'soluble',
      ruleExplanation: 'A grande maioria dos haletos (Cl⁻, Br⁻, I⁻) é solúvel em água.'
    };
  }

  // 4. Sulfatos (SO4)
  if (clean.includes('SO4')) {
    if (clean.startsWith('Ba') || clean.startsWith('Pb') || clean.startsWith('Sr')) {
      return {
        isSoluble: false,
        status: 'insoluble',
        ruleExplanation: 'Sulfatos de bário (Ba²⁺), chumbo (Pb²⁺) e estrôncio (Sr²⁺) são insolúveis.'
      };
    }
    if (clean.startsWith('Ca') || clean.startsWith('Ag')) {
      return {
        isSoluble: false,
        status: 'slightly_soluble',
        ruleExplanation: 'Sulfatos de cálcio (Ca²⁺) e prata (Ag⁺) são pouco solúveis.'
      };
    }
    return {
      isSoluble: true,
      status: 'soluble',
      ruleExplanation: 'A maioria dos sais de sulfato é solúvel em meio aquoso.'
    };
  }

  // 5. Hidróxidos (OH)
  if (clean.includes('OH')) {
    if (clean.startsWith('Ba')) {
      return {
        isSoluble: true,
        status: 'soluble',
        ruleExplanation: 'O hidróxido de bário Ba(OH)₂ é uma base forte solúvel.'
      };
    }
    if (clean.startsWith('Ca') || clean.startsWith('Sr')) {
      return {
        isSoluble: true,
        status: 'slightly_soluble',
        ruleExplanation: 'Hidróxidos de cálcio e estrôncio são moderadamente/parcialmente solúveis.'
      };
    }
    return {
      isSoluble: false,
      status: 'insoluble',
      ruleExplanation: 'A maioria dos hidróxidos metálicos (ex: Fe, Cu, Al, Zn) é insolúvel e precipita em meio aquoso.'
    };
  }

  // 6. Carbonatos (CO3), Fosfatos (PO4), Sulfitos (SO3)
  if (clean.includes('CO3') || clean.includes('PO4') || clean.includes('SO3')) {
    return {
      isSoluble: false,
      status: 'insoluble',
      ruleExplanation: 'Carbonatos, fosfatos e sulfitos são insolúveis, exceto com cátions da família 1A ou amônio.'
    };
  }

  // 7. Sulfetos (S)
  if (clean.endsWith('S') || clean.endsWith('S2') || clean.endsWith('S3')) {
    return {
      isSoluble: false,
      status: 'insoluble',
      ruleExplanation: 'A maioria dos sulfetos metálicos é praticamente insolúvel em água.'
    };
  }

  return {
    isSoluble: true,
    status: 'soluble',
    ruleExplanation: 'Substância considerada solúvel nas condições padrão.'
  };
}
