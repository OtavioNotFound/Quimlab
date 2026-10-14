import { ParsedEquation, ReactionClassificationResult, ReactionTypeClassification, SubstanceParticipant } from './types';
import { findSubstanceInCatalog } from './substanceCatalog';

/**
 * Classifica os tipos de reações químicas apresentadas em uma equação.
 * Suporta múltiplas categorias simultâneas e explicações didáticas detalhadas.
 */
export function classifyReaction(equation: ParsedEquation): ReactionClassificationResult {
  const { reactants, products } = equation;
  const classifications: ReactionTypeClassification[] = [];
  const characteristics: string[] = [];

  if (!equation.isValid || reactants.length === 0 || products.length === 0) {
    return {
      classifications: [],
      explanation: 'Equação inválida para classificação.',
      isChemicallyVerified: false,
      characteristics: []
    };
  }

  // Verifica substâncias simples vs compostas
  const isSimpleSubstance = (p: SubstanceParticipant) => Object.keys(p.parsed.elements).length === 1;
  const isCompoundSubstance = (p: SubstanceParticipant) => Object.keys(p.parsed.elements).length > 1;

  const numReactants = reactants.length;
  const numProducts = products.length;

  const reactantFormulas = reactants.map(r => r.parsed.cleanFormula);
  const productFormulas = products.map(p => p.parsed.cleanFormula);

  // 1. SÍNTESE / COMBINAÇÃO / ADIÇÃO
  // A + B -> AB (2+ reagentes -> 1 produto principal)
  if (numReactants >= 2 && numProducts === 1) {
    classifications.push({
      category: 'synthesis',
      name: 'Síntese ou Combinação',
      definition: 'Duas ou mais substâncias reagentes se combinam para originar um único produto.',
      confidence: 'high'
    });
    characteristics.push('Vários reagentes formam um único composto final.');
  }

  // 2. DECOMPOSIÇÃO / ANÁLISE
  // AB -> A + B (1 reagente -> 2+ produtos)
  if (numReactants === 1 && numProducts >= 2) {
    classifications.push({
      category: 'decomposition',
      name: 'Decomposição ou Análise',
      definition: 'Uma única substância reagente se fragmenta originando duas ou mais substâncias mais simples.',
      confidence: 'high'
    });
    characteristics.push('Um único reagente se divide em múltiplos produtos.');
  }

  // 3. COMBUSTÃO
  // Reação com O2 formando CO2 e H2O (completa) ou CO/C + H2O (incompleta)
  const hasO2Reactant = reactantFormulas.includes('O2');
  const producesCO2 = productFormulas.includes('CO2');
  const producesCO = productFormulas.includes('CO');
  const producesH2O = productFormulas.includes('H2O');

  if (hasO2Reactant && (producesCO2 || producesCO) && producesH2O) {
    const isComplete = producesCO2 && !producesCO;
    classifications.push({
      category: 'combustion',
      name: isComplete ? 'Combustão Completa' : 'Combustão Incompleta',
      definition: isComplete
        ? 'Reação de um combustível com oxigênio (comburente) gerando dióxido de carbono (CO₂) e água (H₂O) com grande liberação de calor.'
        : 'Reação de combustão com quantidade limitada de oxigênio, produzindo monóxido de carbono (CO) e água.',
      confidence: 'high'
    });
    characteristics.push(`Reação exotérmica de queima com oxigênio produzindo ${isComplete ? 'CO₂ e H₂O' : 'CO e H₂O'}.`);
  } else if (hasO2Reactant && numReactants === 2 && !classifications.some(c => c.category === 'combustion')) {
    // Queima simples de metal ou elemento (ex: 2 Mg + O2 -> 2 MgO)
    if (reactants.some(r => isSimpleSubstance(r) && r.parsed.cleanFormula !== 'O2')) {
      classifications.push({
        category: 'combustion',
        name: 'Oxidação Rápida / Combustão Elementar',
        definition: 'Reação direta com oxigênio molecular atuando como agente comburente.',
        confidence: 'medium'
      });
    }
  }

  // 4. NEUTRALIZAÇÃO ÁCIDO-BASE
  // Ácido + Base -> Sal + Água
  const isAcid = (p: SubstanceParticipant) => {
    const f = p.parsed.cleanFormula;
    const cat = findSubstanceInCatalog(f);
    if (cat?.substanceType.toLowerCase().includes('ácido')) return true;
    if (f.startsWith('H') && !['H2', 'H2O', 'H2O2'].includes(f)) return true;
    if (f.endsWith('COOH')) return true;
    return false;
  };

  const isBase = (p: SubstanceParticipant) => {
    const f = p.parsed.cleanFormula;
    const cat = findSubstanceInCatalog(f);
    if (cat?.substanceType.toLowerCase().includes('base')) return true;
    if (f.endsWith('OH') || f.includes('(OH)')) return true;
    if (f === 'NH3') return true;
    return false;
  };

  const hasAcidReactant = reactants.some(isAcid);
  const hasBaseReactant = reactants.some(isBase);
  const hasWaterProduct = productFormulas.includes('H2O');

  if (hasAcidReactant && hasBaseReactant && (hasWaterProduct || productFormulas.length === 1)) {
    classifications.push({
      category: 'neutralization',
      name: 'Neutralização Ácido-Base',
      definition: 'Reação entre um ácido e uma base com formação típica de água e um sal, neutralizando o caráter ácido e alcalino.',
      confidence: 'high'
    });
    characteristics.push('Ácido reage com base originando sal e água.');
  }

  // 5. SIMPLES TROCA OU DESLOCAMENTO
  // A + BC -> AC + B (1 simples + 1 composta -> 1 simples + 1 composta)
  const reactantSimples = reactants.filter(isSimpleSubstance);
  const reactantCompounds = reactants.filter(isCompoundSubstance);
  const productSimples = products.filter(isSimpleSubstance);
  const productCompounds = products.filter(isCompoundSubstance);

  if (
    reactantSimples.length === 1 &&
    reactantCompounds.length === 1 &&
    productSimples.length === 1 &&
    productCompounds.length === 1
  ) {
    classifications.push({
      category: 'single_replacement',
      name: 'Simples Troca ou Deslocamento',
      definition: 'Uma substância simples reage com uma substância composta, deslocando um dos elementos para formar uma nova substância simples e um novo composto.',
      confidence: 'high'
    });
    characteristics.push(`O elemento ${reactantSimples[0].formula} desloca componentes de ${reactantCompounds[0].formula}.`);
  }

  // 6. DUPLA TROCA OU METÁTESE
  // AB + CD -> AD + CB (2 compostos -> 2 compostos)
  if (
    numReactants === 2 &&
    numProducts === 2 &&
    reactantCompounds.length === 2 &&
    productCompounds.length === 2 &&
    !classifications.some(c => c.category === 'combustion' || c.category === 'single_replacement')
  ) {
    classifications.push({
      category: 'double_replacement',
      name: 'Dupla Troca ou Metátese',
      definition: 'Dois compostos iônicos ou moleculares em solução permutem seus parceiros de ligação, formando dois novos compostos.',
      confidence: 'high'
    });
    characteristics.push('Dois compostos trocam seus íons ou grupos funcionais.');
  }

  // 7. PRECIPITAÇÃO
  // Formação de precipitado insolúvel (sólido formado a partir de soluções)
  const hasPrecipitateProduct = products.some(p => {
    if (p.parsed.state === 's') return true;
    const cat = findSubstanceInCatalog(p.parsed.cleanFormula);
    return cat?.solubilityInWater === 'insoluble';
  });

  if (hasPrecipitateProduct && (numReactants >= 2)) {
    const insolubleName = products.find(p => {
      if (p.parsed.state === 's') return true;
      const cat = findSubstanceInCatalog(p.parsed.cleanFormula);
      return cat?.solubilityInWater === 'insoluble';
    })?.formula;

    classifications.push({
      category: 'precipitation',
      name: 'Precipitação',
      definition: 'Reação iônica em solução que produz uma substância sólida de baixíssima solubilidade (precipitado).',
      confidence: 'medium'
    });
    characteristics.push(`Formação de fase sólida insolúvel (${insolubleName || 'precipitado'}).`);
  }

  // 8. FORMAÇÃO DE GÁS
  const gasProducts = ['CO2', 'H2', 'SO2', 'NH3', 'O2', 'Cl2', 'H2S'];
  const hasGasFormation = products.some(p => p.parsed.state === 'g' || gasProducts.includes(p.parsed.cleanFormula));
  const hasCarbonateAcid = reactantFormulas.some(f => f.includes('CO3')) && hasAcidReactant;

  if (hasCarbonateAcid || (hasGasFormation && numReactants >= 2 && !classifications.some(c => c.category === 'combustion'))) {
    classifications.push({
      category: 'gas_formation',
      name: 'Formação de Gás (Efervescência)',
      definition: 'Reação que libera uma espécie gasosa que se desprende do meio reacional sob forma de gás ou efervescência.',
      confidence: 'medium'
    });
    characteristics.push('Liberação de substância em estado gasoso.');
  }

  // 9. OXIRREDUÇÃO (REDOX)
  // Quase todas as combustões, simples trocas, e reações envolvendo substâncias simples com variação de Nox são redox
  const isRedox =
    classifications.some(c => c.category === 'combustion' || c.category === 'single_replacement') ||
    (reactantSimples.length > 0 && productCompounds.length > 0) ||
    (reactantCompounds.length > 0 && productSimples.length > 0) ||
    reactantFormulas.includes('KMnO4') ||
    reactantFormulas.includes('H2O2');

  if (isRedox && !classifications.some(c => c.category === 'redox')) {
    classifications.push({
      category: 'redox',
      name: 'Oxirredução (Redox)',
      definition: 'Ocorre transferência efetiva de elétrons com alteração nos números de oxidação (Nox) dos átomos participantes.',
      confidence: 'high'
    });
    characteristics.push('Variação nos números de oxidação com transferência de elétrons.');
  }

  // 10. REAÇÃO ORGÂNICA (ESTEIRIFICAÇÃO, ETC.)
  const hasEsterification =
    reactants.some(r => r.parsed.cleanFormula === 'CH3COOH' || r.formula.includes('COOH')) &&
    reactants.some(r => r.parsed.cleanFormula === 'C2H5OH' || r.formula.includes('OH'));

  if (hasEsterification) {
    classifications.push({
      category: 'organic',
      name: 'Esterificação',
      definition: 'Reação orgânica entre um ácido carboxílico e um álcool, formando um éster e água.',
      confidence: 'high'
    });
    characteristics.push('Condensação de ácido carboxílico e álcool gerando éster.');
  }

  // Se nenhuma classificação foi encontrada
  if (classifications.length === 0) {
    classifications.push({
      category: 'synthesis',
      name: 'Reação Não Classificada nos Padrões Básicos',
      definition: 'A reação não se enquadrou perfeitamente nas regras heurísticas padrão do catálogo escolar.',
      confidence: 'low'
    });
  }

  // Montar explicação didática textual
  const explanation = buildDetailedExplanation(equation, classifications, characteristics);

  return {
    classifications,
    explanation,
    isChemicallyVerified: classifications.some(c => c.confidence === 'high'),
    characteristics
  };
}

function buildDetailedExplanation(
  equation: ParsedEquation,
  classifications: ReactionTypeClassification[],
  characteristics: string[]
): string {
  const catNames = classifications.map(c => `**${c.name}**`).join(', ');
  const rNames = equation.reactants.map(r => {
    const info = findSubstanceInCatalog(r.parsed.cleanFormula);
    return info ? `${info.preferredName} (${r.formula})` : r.formula;
  }).join(' e ');

  const pNames = equation.products.map(p => {
    const info = findSubstanceInCatalog(p.parsed.cleanFormula);
    return info ? `${info.preferredName} (${p.formula})` : p.formula;
  }).join(' e ');

  const charText = characteristics.length > 0 ? ` Evidências observadas: ${characteristics.join(' ')}` : '';

  return `Nesta transformação química, ${rNames} reagem para formar ${pNames}. A reação é classificada como ${catNames}.${charText}`;
}
