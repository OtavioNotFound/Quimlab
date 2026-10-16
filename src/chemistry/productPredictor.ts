import { parseEquation } from './equationParser';
import { PRESET_REACTIONS } from './presetReactions';
import { SubstanceParticipant } from './types';

export interface ProductPrediction {
  equation: string;
  products: string[];
  source: 'preset' | 'reaction-library' | 'combustion-rule';
  reactionType: string;
  explanation: string;
  confidence: 'high' | 'medium';
}

interface KnownProductRule {
  reactants: string[];
  products: string[];
  reactionType: string;
  explanation: string;
}

const ARROW_PATTERN = /<=>|<->|⇌|-->|->|==>|=>|→|=/g;

const KNOWN_PRODUCT_RULES: KnownProductRule[] = [
  rule(['HCl', 'KOH'], ['KCl', 'H2O'], 'Neutralização', 'Ácido e base formam sal e água.'),
  rule(['HCl', 'Ca(OH)2'], ['CaCl2', 'H2O'], 'Neutralização', 'O ácido clorídrico neutraliza o hidróxido de cálcio.'),
  rule(['HCl', 'Mg(OH)2'], ['MgCl2', 'H2O'], 'Neutralização', 'O ácido clorídrico neutraliza o hidróxido de magnésio.'),
  rule(['H2SO4', 'NaOH'], ['Na2SO4', 'H2O'], 'Neutralização', 'O ácido sulfúrico e a base formam sulfato de sódio e água.'),
  rule(['H2SO4', 'KOH'], ['K2SO4', 'H2O'], 'Neutralização', 'O ácido sulfúrico e a base formam sulfato de potássio e água.'),
  rule(['H2SO4', 'Ca(OH)2'], ['CaSO4', 'H2O'], 'Neutralização', 'O ácido sulfúrico e a base formam sulfato de cálcio e água.'),
  rule(['HNO3', 'NaOH'], ['NaNO3', 'H2O'], 'Neutralização', 'O ácido nítrico e a base formam nitrato de sódio e água.'),
  rule(['HNO3', 'KOH'], ['KNO3', 'H2O'], 'Neutralização', 'O ácido nítrico e a base formam nitrato de potássio e água.'),
  rule(['CH3COOH', 'NaOH'], ['CH3COONa', 'H2O'], 'Neutralização', 'O ácido acético e a base formam acetato de sódio e água.'),
  rule(['H3PO4', 'NaOH'], ['Na3PO4', 'H2O'], 'Neutralização', 'A neutralização total produz fosfato de sódio e água.'),

  rule(['CaCO3', 'HCl'], ['CaCl2', 'H2O', 'CO2'], 'Ácido-carbonato', 'Ácidos reagem com carbonatos liberando dióxido de carbono.'),
  rule(['Na2CO3', 'HCl'], ['NaCl', 'H2O', 'CO2'], 'Ácido-carbonato', 'Ácidos reagem com carbonatos liberando dióxido de carbono.'),
  rule(['K2CO3', 'HCl'], ['KCl', 'H2O', 'CO2'], 'Ácido-carbonato', 'Ácidos reagem com carbonatos liberando dióxido de carbono.'),
  rule(['NaHCO3', 'CH3COOH'], ['CH3COONa', 'H2O', 'CO2'], 'Ácido-bicarbonato', 'O bicarbonato reage com o ácido e produz efervescência de CO₂.'),

  rule(['Mg', 'HCl'], ['MgCl2', 'H2'], 'Simples troca', 'O magnésio desloca o hidrogênio do ácido.'),
  rule(['Fe', 'HCl'], ['FeCl2', 'H2'], 'Simples troca', 'O ferro desloca o hidrogênio do ácido diluído.'),
  rule(['Al', 'HCl'], ['AlCl3', 'H2'], 'Simples troca', 'O alumínio desloca o hidrogênio do ácido após romper sua camada de óxido.'),
  rule(['Zn', 'H2SO4'], ['ZnSO4', 'H2'], 'Simples troca', 'O zinco desloca o hidrogênio do ácido sulfúrico diluído.'),
  rule(['Mg', 'H2SO4'], ['MgSO4', 'H2'], 'Simples troca', 'O magnésio desloca o hidrogênio do ácido sulfúrico diluído.'),
  rule(['Fe', 'CuSO4'], ['FeSO4', 'Cu'], 'Simples troca', 'O ferro, mais reativo, desloca o cobre da solução.'),
  rule(['Cu', 'AgNO3'], ['Cu(NO3)2', 'Ag'], 'Simples troca', 'O cobre desloca a prata do nitrato de prata.'),
  rule(['Mg', 'CuSO4'], ['MgSO4', 'Cu'], 'Simples troca', 'O magnésio desloca o cobre da solução.'),

  rule(['AgNO3', 'KCl'], ['AgCl', 'KNO3'], 'Dupla troca / precipitação', 'Forma-se o precipitado insolúvel de cloreto de prata.'),
  rule(['BaCl2', 'Na2SO4'], ['BaSO4', 'NaCl'], 'Dupla troca / precipitação', 'Forma-se o precipitado insolúvel de sulfato de bário.'),
  rule(['Pb(NO3)2', 'KI'], ['PbI2', 'KNO3'], 'Dupla troca / precipitação', 'Forma-se o precipitado amarelo de iodeto de chumbo(II).'),
  rule(['CaCl2', 'Na2CO3'], ['CaCO3', 'NaCl'], 'Dupla troca / precipitação', 'Forma-se carbonato de cálcio pouco solúvel.'),
  rule(['CuSO4', 'NaOH'], ['Cu(OH)2', 'Na2SO4'], 'Dupla troca / precipitação', 'Forma-se hidróxido de cobre(II), um precipitado azul.'),
  rule(['FeCl3', 'NaOH'], ['Fe(OH)3', 'NaCl'], 'Dupla troca / precipitação', 'Forma-se hidróxido de ferro(III), um precipitado castanho.'),
  rule(['MgCl2', 'NaOH'], ['Mg(OH)2', 'NaCl'], 'Dupla troca / precipitação', 'Forma-se hidróxido de magnésio pouco solúvel.'),
  rule(['Na2SO4', 'Pb(NO3)2'], ['PbSO4', 'NaNO3'], 'Dupla troca / precipitação', 'Forma-se sulfato de chumbo(II) pouco solúvel.'),

  rule(['CaO', 'H2O'], ['Ca(OH)2'], 'Síntese', 'Um óxido básico reage com água e forma uma base.'),
  rule(['Na2O', 'H2O'], ['NaOH'], 'Síntese', 'Um óxido básico reage com água e forma uma base.'),
  rule(['SO3', 'H2O'], ['H2SO4'], 'Síntese', 'Um óxido ácido reage com água e forma um oxiácido.'),
  rule(['SO2', 'H2O'], ['H2SO3'], 'Síntese', 'Um óxido ácido reage com água e forma um oxiácido.'),
  rule(['CO2', 'H2O'], ['H2CO3'], 'Síntese', 'O dióxido de carbono dissolvido em água forma ácido carbônico.'),
  rule(['CaO', 'CO2'], ['CaCO3'], 'Síntese', 'Óxido básico e óxido ácido formam um sal.'),
  rule(['N2', 'H2'], ['NH3'], 'Síntese', 'Nitrogênio e hidrogênio formam amônia nas condições do processo Haber-Bosch.'),
  rule(['Mg', 'O2'], ['MgO'], 'Síntese / oxirredução', 'O magnésio reage com oxigênio formando óxido de magnésio.'),
  rule(['Al', 'O2'], ['Al2O3'], 'Síntese / oxirredução', 'O alumínio reage com oxigênio formando óxido de alumínio.'),
  rule(['C', 'O2'], ['CO2'], 'Combustão', 'Na combustão completa do carbono forma-se dióxido de carbono.'),
  rule(['S', 'O2'], ['SO2'], 'Combustão', 'O enxofre queima em oxigênio formando dióxido de enxofre.'),

  rule(['KClO3'], ['KCl', 'O2'], 'Decomposição', 'Sob aquecimento e catalisador, o clorato de potássio libera oxigênio.'),
  rule(['NaHCO3'], ['Na2CO3', 'H2O', 'CO2'], 'Decomposição', 'O bicarbonato de sódio aquecido forma carbonato, água e dióxido de carbono.'),
  rule(['MgCO3'], ['MgO', 'CO2'], 'Decomposição', 'O carbonato de magnésio aquecido forma óxido e dióxido de carbono.'),
  rule(['CuCO3'], ['CuO', 'CO2'], 'Decomposição', 'O carbonato de cobre(II) aquecido forma óxido e dióxido de carbono.'),
  rule(['H2CO3'], ['H2O', 'CO2'], 'Decomposição', 'O ácido carbônico é instável e se decompõe em água e dióxido de carbono.'),
  rule(['NH4NO3'], ['N2O', 'H2O'], 'Decomposição', 'Sob aquecimento controlado, o nitrato de amônio pode formar óxido nitroso e água.'),
  rule(['H2O'], ['H2', 'O2'], 'Eletrólise', 'A eletrólise da água produz hidrogênio e oxigênio.'),

  rule(['C2H4', 'H2'], ['C2H6'], 'Adição / hidrogenação', 'O hidrogênio adiciona-se à ligação dupla do eteno.'),
  rule(['C2H2', 'H2'], ['C2H4'], 'Adição / hidrogenação', 'Uma etapa de hidrogenação do etino forma eteno.'),
  rule(['C2H5OH', 'CH3COOH'], ['CH3COOC2H5', 'H2O'], 'Esterificação', 'Ácido acético e etanol formam etanoato de etila e água em equilíbrio.'),
  rule(['C2H4', 'H2O'], ['C2H5OH'], 'Adição / hidratação', 'A hidratação catalítica do eteno forma etanol.'),
];

/** Predicts products from the educational library or a complete-combustion rule. */
export function predictReactionProducts(input: string): ProductPrediction | null {
  const reactantSide = extractReactantSide(input);
  if (!reactantSide) return null;

  const parsedInput = parseEquation(`${reactantSide} -> H2O`);
  if (!parsedInput.isValid) return null;

  const reactantKey = getFormulaKey(parsedInput.reactants);

  for (const preset of PRESET_REACTIONS) {
    const parsedPreset = parseEquation(preset.unbalanced);
    if (!parsedPreset.isValid || getFormulaKey(parsedPreset.reactants) !== reactantKey) continue;

    return buildPrediction(
      reactantSide,
      parsedPreset.products.map(participant => participant.parsed.cleanFormula),
      'preset',
      preset.category,
      preset.didacticTips,
      'high'
    );
  }

  const knownRule = KNOWN_PRODUCT_RULES.find(candidate => getStringFormulaKey(candidate.reactants) === reactantKey);
  if (knownRule) {
    return buildPrediction(
      reactantSide,
      knownRule.products,
      'reaction-library',
      knownRule.reactionType,
      knownRule.explanation,
      'high'
    );
  }

  const oxygen = parsedInput.reactants.find(participant => participant.parsed.cleanFormula === 'O2');
  const fuel = parsedInput.reactants.find(participant => {
    const elements = Object.keys(participant.parsed.elements);
    return participant.parsed.elements.C
      && participant.parsed.elements.H
      && elements.every(element => ['C', 'H', 'O'].includes(element));
  });

  if (parsedInput.reactants.length === 2 && oxygen && fuel) {
    return buildPrediction(
      reactantSide,
      ['CO2', 'H2O'],
      'combustion-rule',
      'Combustão completa',
      'Com oxigênio suficiente, compostos de carbono e hidrogênio formam CO₂ e H₂O.',
      'medium'
    );
  }

  return null;
}

function extractReactantSide(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const arrows = [...trimmed.matchAll(ARROW_PATTERN)];
  if (arrows.length === 0) return trimmed;

  const lastArrow = arrows.at(-1)!;
  const rightSide = trimmed.slice(lastArrow.index! + lastArrow[0].length).trim();
  if (rightSide) return null;

  return trimmed.slice(0, lastArrow.index).trim() || null;
}

function buildPrediction(
  reactantSide: string,
  products: string[],
  source: ProductPrediction['source'],
  reactionType: string,
  explanation: string,
  confidence: ProductPrediction['confidence']
): ProductPrediction {
  return {
    equation: `${reactantSide} -> ${products.join(' + ')}`,
    products,
    source,
    reactionType,
    explanation,
    confidence
  };
}

function rule(
  reactants: string[],
  products: string[],
  reactionType: string,
  explanation: string
): KnownProductRule {
  return { reactants, products, reactionType, explanation };
}

function getFormulaKey(participants: SubstanceParticipant[]): string {
  return participants.map(participant => participant.parsed.cleanFormula).sort().join('|');
}

function getStringFormulaKey(formulas: string[]): string {
  return [...formulas].sort().join('|');
}
