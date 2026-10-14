import { CatalogSubstance } from './types';
import { parseFormula } from './formulaParser';

/**
 * Catálogo de substâncias químicas validadas com nomenclatura oficial (IUPAC),
 * nomes usuais/populares, massas molares e descrições didáticas em português.
 */
export const SUBSTANCE_CATALOG: CatalogSubstance[] = [
  {
    formula: 'H2O',
    preferredName: 'Água',
    commonNames: ['Monóxido de di-hidrogênio'],
    description: 'Composto vital indispensável para todos os seres vivos, atuando como o solvente universal.',
    molarMass: 18.015,
    substanceType: 'Composto molecular (óxido)',
    composition: { H: 2, O: 1 },
    stateStandard: 'l',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'O2',
    preferredName: 'Oxigênio molecular',
    commonNames: ['Gás oxigênio', 'Oxigênio'],
    description: 'Gás comburente incolor e inodoro essencial para a respiração aeróbica e processos de combustão.',
    molarMass: 31.998,
    substanceType: 'Substância simples (não metal)',
    composition: { O: 2 },
    stateStandard: 'g'
  },
  {
    formula: 'H2',
    preferredName: 'Hidrogênio molecular',
    commonNames: ['Gás hidrogênio', 'Hidrogênio'],
    description: 'Elemento mais leve e abundante do universo. É um gás altamente inflamável usado como combustível sustentável.',
    molarMass: 2.016,
    substanceType: 'Substância simples (não metal)',
    composition: { H: 2 },
    stateStandard: 'g'
  },
  {
    formula: 'CO2',
    preferredName: 'Dióxido de carbono',
    commonNames: ['Gás carbônico', 'Anidrido carbônico'],
    description: 'Gás incolor resultante da respiração e da combustão completa de compostos de carbono. Importante gás de efeito estufa e fotossíntese.',
    molarMass: 44.01,
    substanceType: 'Óxido ácido (não metal)',
    composition: { C: 1, O: 2 },
    stateStandard: 'g',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'CO',
    preferredName: 'Monóxido de carbono',
    commonNames: ['Gás monóxido'],
    description: 'Gás inodoro, incolor e altamente tóxico produzido na combustão incompleta de compostos de carbono.',
    molarMass: 28.01,
    substanceType: 'Óxido neutro',
    composition: { C: 1, O: 1 },
    stateStandard: 'g'
  },
  {
    formula: 'CH4',
    preferredName: 'Metano',
    commonNames: ['Gás dos pântanos', 'Principal componente do gás natural'],
    description: 'O mais simples dos hidrocarbonetos alcanos. Combustível fóssil limpo com alto teor energético.',
    molarMass: 16.043,
    substanceType: 'Hidrocarboneto (alcano)',
    composition: { C: 1, H: 4 },
    stateStandard: 'g'
  },
  {
    formula: 'NaCl',
    preferredName: 'Cloreto de sódio',
    commonNames: ['Sal de cozinha', 'Halita'],
    description: 'Composto iônico essencial para o equilíbrio eletrolítico no organismo e amplo uso culinário e industrial.',
    molarMass: 58.443,
    substanceType: 'Sal neutro (iônico)',
    composition: { Na: 1, Cl: 1 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'HCl',
    preferredName: 'Ácido clorídrico',
    commonNames: ['Cloreto de hidrogênio (gás)', 'Ácido muriático (comercial)'],
    description: 'Ácido inorgânico forte formado pela dissolução de HCl gasoso em água. Presente no suco gástrico.',
    molarMass: 36.461,
    substanceType: 'Hidrácido forte',
    composition: { H: 1, Cl: 1 },
    stateStandard: 'aq',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'NaOH',
    preferredName: 'Hidróxido de sódio',
    commonNames: ['Soda cáustica'],
    description: 'Base forte amplamente utilizada na fabricação de sabão, papel, tecidos e desentupidores.',
    molarMass: 39.997,
    substanceType: 'Base forte (inorgânica)',
    composition: { Na: 1, O: 1, H: 1 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'CaCO3',
    preferredName: 'Carbonato de cálcio',
    commonNames: ['Calcário', 'Mármore', 'Giz'],
    description: 'Sal inorgânico pouco solúvel em água, constituinte principal de cascas de ovos, conchas e rochas calcárias.',
    molarMass: 100.087,
    substanceType: 'Sal oxigenado',
    composition: { Ca: 1, C: 1, O: 3 },
    stateStandard: 's',
    solubilityInWater: 'insoluble'
  },
  {
    formula: 'CaO',
    preferredName: 'Óxido de cálcio',
    commonNames: ['Cal virgem', 'Cal viva'],
    description: 'Óxido básico obtido pela calcinação do calcário. Reage fortemente com água liberando calor.',
    molarMass: 56.077,
    substanceType: 'Óxido básico',
    composition: { Ca: 1, O: 1 },
    stateStandard: 's',
    solubilityInWater: 'slightly_soluble'
  },
  {
    formula: 'Ca(OH)2',
    preferredName: 'Hidróxido de cálcio',
    commonNames: ['Cal hidratada', 'Cal apagada', 'Água de cal'],
    description: 'Base formada pela reação da cal virgem com água. Usada na construção civil e correção de acidez de solos.',
    molarMass: 74.093,
    substanceType: 'Base inorgânica',
    composition: { Ca: 1, O: 2, H: 2 },
    stateStandard: 's',
    solubilityInWater: 'slightly_soluble'
  },
  {
    formula: 'H2SO4',
    preferredName: 'Ácido sulfúrico',
    commonNames: ['Óleo de vitríolo', 'Ácido de bateria'],
    description: 'Ácido inorgânico forte e desidratante de extrema importância industrial na síntese de fertilizantes e refino.',
    molarMass: 98.079,
    substanceType: 'Oxiácido diprótico forte',
    composition: { H: 2, S: 1, O: 4 },
    stateStandard: 'l',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'HNO3',
    preferredName: 'Ácido nítrico',
    commonNames: ['Água-forte'],
    description: 'Ácido forte e poderoso agente oxidante empregado na produção de fertilizantes e explosivos.',
    molarMass: 63.013,
    substanceType: 'Oxiácido forte',
    composition: { H: 1, N: 1, O: 3 },
    stateStandard: 'l',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'NH3',
    preferredName: 'Amônia',
    commonNames: ['Amoníaco', 'Gás amoníaco'],
    description: 'Gás de odor pungente produzido em larga escala pelo processo Haber-Bosch para fertilizantes agrícolas.',
    molarMass: 17.031,
    substanceType: 'Composto molecular básico',
    composition: { N: 1, H: 3 },
    stateStandard: 'g',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'NH4Cl',
    preferredName: 'Cloreto de amônio',
    commonNames: ['Sal amoníaco'],
    description: 'Sal formado pela reação entre amônia e ácido clorídrico. Usado em baterias secas e fluxo de solda.',
    molarMass: 53.491,
    substanceType: 'Sal inorgânico',
    composition: { N: 1, H: 4, Cl: 1 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'AgNO3',
    preferredName: 'Nitrato de prata',
    commonNames: ['Cáustico lunar'],
    description: 'Sal solúvel de prata utilizado em análises quantitativas de haletos e na medicina antisséptica.',
    molarMass: 169.873,
    substanceType: 'Sal oxigenado solúvel',
    composition: { Ag: 1, N: 1, O: 3 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'AgCl',
    preferredName: 'Cloreto de prata',
    commonNames: ['Cerargirita'],
    description: 'Sólido branco altamente insolúvel em água, comumente formado como precipitado em testes de cloretos.',
    molarMass: 143.321,
    substanceType: 'Sal halogenado insolúvel',
    composition: { Ag: 1, Cl: 1 },
    stateStandard: 's',
    solubilityInWater: 'insoluble'
  },
  {
    formula: 'NaNO3',
    preferredName: 'Nitrato de sódio',
    commonNames: ['Salitre do Chile'],
    description: 'Sal muito solúvel em água utilizado como fertilizante nitrogenado e conservante alimentar.',
    molarMass: 84.995,
    substanceType: 'Sal oxigenado solúvel',
    composition: { Na: 1, N: 1, O: 3 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'Zn',
    preferredName: 'Zinco metálico',
    commonNames: ['Zinco'],
    description: 'Metal de transição utilizado na galvanização do ferro e aço para proteção contra corrosão.',
    molarMass: 65.38,
    substanceType: 'Substância simples (metal)',
    composition: { Zn: 1 },
    stateStandard: 's'
  },
  {
    formula: 'ZnCl2',
    preferredName: 'Cloreto de zinco',
    commonNames: ['Manteiga de zinco'],
    description: 'Sal higroscópico solúvel em água usado em soldagem, preservação de madeira e desodorizantes.',
    molarMass: 136.315,
    substanceType: 'Sal inorgânico solúvel',
    composition: { Zn: 1, Cl: 2 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'CuSO4',
    preferredName: 'Sulfato de cobre(II)',
    commonNames: ['Sulfato cúprico'],
    description: 'Sal inorgânico anidro branco/acinzentado, que ao hidratar-se torna-se de azul intenso.',
    molarMass: 159.609,
    substanceType: 'Sal inorgânico solúvel',
    composition: { Cu: 1, S: 1, O: 4 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'ZnSO4',
    preferredName: 'Sulfato de zinco',
    commonNames: ['Vitríolo branco'],
    description: 'Sal inorgânico solúvel utilizado como suplemento dietético de zinco e na manufatura de fios sintéticos.',
    molarMass: 161.47,
    substanceType: 'Sal inorgânico solúvel',
    composition: { Zn: 1, S: 1, O: 4 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'Cu',
    preferredName: 'Cobre metálico',
    commonNames: ['Cobre'],
    description: 'Metal avermelhado de excelente condutividade térmica e elétrica amplamente usado em fiações.',
    molarMass: 63.546,
    substanceType: 'Substância simples (metal)',
    composition: { Cu: 1 },
    stateStandard: 's'
  },
  {
    formula: 'Fe',
    preferredName: 'Ferro metálico',
    commonNames: ['Ferro'],
    description: 'Metal mais utilizado pela humanidade, componente essencial do aço e da hemoglobina no sangue.',
    molarMass: 55.845,
    substanceType: 'Substância simples (metal)',
    composition: { Fe: 1 },
    stateStandard: 's'
  },
  {
    formula: 'Fe2O3',
    preferredName: 'Óxido de ferro(III)',
    commonNames: ['Hematita', 'Ferrugem'],
    description: 'Principal minério de ferro e principal constituinte da ferrugem decorrente da oxidação do ferro.',
    molarMass: 159.69,
    substanceType: 'Óxido metálico anfótero',
    composition: { Fe: 2, O: 3 },
    stateStandard: 's',
    solubilityInWater: 'insoluble'
  },
  {
    formula: 'Na2CO3',
    preferredName: 'Carbonato de sódio',
    commonNames: ['Barrilha', 'Soda cristal'],
    description: 'Sal solúvel muito utilizado na produção de vidro, detergentes e tratamento de águas.',
    molarMass: 105.989,
    substanceType: 'Sal de caráter básico',
    composition: { Na: 2, C: 1, O: 3 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'NaHCO3',
    preferredName: 'Bicarbonato de sódio',
    commonNames: ['Hidrogenocarbonato de sódio', 'Fermento químico'],
    description: 'Sal de amplo uso como antiácido estomacal, fermento químico culinário e neutralizador de odores.',
    molarMass: 84.007,
    substanceType: 'Sal ácido solúvel',
    composition: { Na: 1, H: 1, C: 1, O: 3 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'C2H5OH',
    preferredName: 'Etanol',
    commonNames: ['Álcool etílico', 'Álcool de cereais'],
    description: 'Álcool líquido renovável usado como combustível automotivo, solvente e desinfetante.',
    molarMass: 46.069,
    substanceType: 'Composto orgânico (álcool)',
    composition: { C: 2, H: 6, O: 1 },
    stateStandard: 'l',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'CH3COOH',
    preferredName: 'Ácido acético',
    commonNames: ['Ácido etanoico', 'Vinagre (solução a 4-5%)'],
    description: 'Ácido orgânico fraco responsável pelo sabor e aroma característicos do vinagre comercial.',
    molarMass: 60.052,
    substanceType: 'Ácido carboxílico (orgânico)',
    composition: { C: 2, H: 4, O: 2 },
    stateStandard: 'l',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'C6H12O6',
    preferredName: 'Glicose',
    commonNames: ['Dextrose', 'Açúcar do sangue'],
    description: 'Monossacarídeo fundamental fonte primária de energia biológica gerada na fotossíntese e oxidada na respiração.',
    molarMass: 180.156,
    substanceType: 'Carboidrato (monossacarídeo)',
    composition: { C: 6, H: 12, O: 6 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'H2O2',
    preferredName: 'Peróxido de hidrogênio',
    commonNames: ['Água oxigenada'],
    description: 'Líquido oxidante e antisséptico que se decompõe em água e oxigênio molecular na presença de catalisadores.',
    molarMass: 34.015,
    substanceType: 'Peróxido',
    composition: { H: 2, O: 2 },
    stateStandard: 'l',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'KMnO4',
    preferredName: 'Permanganato de potássio',
    commonNames: ['Condy\'s crystals'],
    description: 'Sal roxo escuro de forte poder oxidante, comumente usado em desinfecções e titulações redox.',
    molarMass: 158.034,
    substanceType: 'Sal oxigenado de metal de transição',
    composition: { K: 1, Mn: 1, O: 4 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'KCl',
    preferredName: 'Cloreto de potássio',
    commonNames: ['Silvita'],
    description: 'Sal utilizado como fertilizante de potássio e como substituto de sódio em dietas com baixo teor de sódio.',
    molarMass: 74.551,
    substanceType: 'Sal inorgânico solúvel',
    composition: { K: 1, Cl: 1 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'MnCl2',
    preferredName: 'Cloreto de manganês(II)',
    commonNames: ['Dicloreto de manganês'],
    description: 'Sal solúvel rosado obtido na reação de compostos de manganês com ácido clorídrico.',
    molarMass: 125.844,
    substanceType: 'Sal inorgânico solúvel',
    composition: { Mn: 1, Cl: 2 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'Cl2',
    preferredName: 'Cloro molecular',
    commonNames: ['Gás cloro'],
    description: 'Gás verde-amarelado sufocante e altamente reativo empregado no tratamento e desinfecção de águas.',
    molarMass: 70.90,
    substanceType: 'Substância simples (halogênio)',
    composition: { Cl: 2 },
    stateStandard: 'g',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'Al2(SO4)3',
    preferredName: 'Sulfato de alumínio',
    commonNames: ['Alúmen de bolo'],
    description: 'Sal coagulante largamente empregado nas estações de tratamento de água potável (floculação).',
    molarMass: 342.15,
    substanceType: 'Sal inorgânico solúvel',
    composition: { Al: 2, S: 3, O: 12 },
    stateStandard: 's',
    solubilityInWater: 'soluble'
  },
  {
    formula: 'Al(OH)3',
    preferredName: 'Hidróxido de alumínio',
    commonNames: ['Giba'],
    description: 'Precipitado gelatinoso branco utilizado como antiácido estomacal e adjuvante de vacinas.',
    molarMass: 78.003,
    substanceType: 'Base inorgânica insolúvel',
    composition: { Al: 1, O: 3, H: 3 },
    stateStandard: 's',
    solubilityInWater: 'insoluble'
  },
  {
    formula: 'CaSO4',
    preferredName: 'Sulfato de cálcio',
    commonNames: ['Gesso', 'Anidrita'],
    description: 'Sal pouco solúvel formador do gesso e do alabastro na construção civil e ortopedia.',
    molarMass: 136.14,
    substanceType: 'Sal inorgânico pouco solúvel',
    composition: { Ca: 1, S: 1, O: 4 },
    stateStandard: 's',
    solubilityInWater: 'slightly_soluble'
  },
  {
    formula: 'N2',
    preferredName: 'Nitrogênio molecular',
    commonNames: ['Gás nitrogênio', 'Azoto'],
    description: 'Gás diatômico inerte que compõe cerca de 78% da atmosfera terrestre.',
    molarMass: 28.014,
    substanceType: 'Substância simples (não metal)',
    composition: { N: 2 },
    stateStandard: 'g'
  }
];

/**
 * Normaliza uma fórmula para busca (remove espaços, converte minúsculas de caracteres de estado, etc.)
 */
export function normalizeFormulaForLookup(formula: string): string {
  return formula
    .replace(/\s+/g, '')
    .replace(/\((s|l|g|aq)\)$/i, '')
    .trim();
}

/**
 * Procura uma substância no catálogo por sua fórmula exata ou normalizada.
 * Se não encontrar por string direta, tenta comparar por composição atômica!
 */
export function findSubstanceInCatalog(formula: string): CatalogSubstance | undefined {
  const norm = normalizeFormulaForLookup(formula);

  // 1. Busca por fórmula exata
  const exact = SUBSTANCE_CATALOG.find(s => normalizeFormulaForLookup(s.formula).toLowerCase() === norm.toLowerCase());
  if (exact) return exact;

  // 2. Busca por composição elementar
  try {
    const parsed = parseFormula(formula);
    const parsedKeys = Object.keys(parsed.elements).sort();

    const matchByComp = SUBSTANCE_CATALOG.find(sub => {
      const subKeys = Object.keys(sub.composition).sort();
      if (parsedKeys.length !== subKeys.length) return false;
      for (let i = 0; i < parsedKeys.length; i++) {
        const k = parsedKeys[i];
        if (k !== subKeys[i]) return false;
        if (parsed.elements[k] !== sub.composition[k]) return false;
      }
      return true;
    });

    if (matchByComp) return matchByComp;
  } catch {
    // Ignora erro no parse para não quebrar a busca
  }

  // 3. Busca por nome usual ou preferido
  const query = norm.toLowerCase();
  return SUBSTANCE_CATALOG.find(s =>
    s.preferredName.toLowerCase() === query ||
    s.commonNames.some(c => c.toLowerCase() === query)
  );
}

/**
 * Busca flexível de substâncias para autocompletar e sugestões.
 */
export function searchSubstances(query: string, limit = 8): CatalogSubstance[] {
  if (!query || !query.trim()) return SUBSTANCE_CATALOG.slice(0, limit);
  const q = query.trim().toLowerCase();

  return SUBSTANCE_CATALOG.filter(s =>
    s.formula.toLowerCase().includes(q) ||
    s.preferredName.toLowerCase().includes(q) ||
    s.commonNames.some(cn => cn.toLowerCase().includes(q)) ||
    s.substanceType.toLowerCase().includes(q)
  ).slice(0, limit);
}
