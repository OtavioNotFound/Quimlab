/**
 * Tipos e interfaces fundamentais do motor químico do QuimLab.
 * Este módulo é 100% puro e agnóstico de UI (compatível com React, React Native e Node).
 */

export type ElementCount = Record<string, number>;

export type StateOfMatter = 's' | 'l' | 'g' | 'aq';

export interface ParsedFormula {
  raw: string;
  cleanFormula: string;
  elements: ElementCount;
  molarMass: number;
  state?: StateOfMatter;
  charge?: number;
  hydrateCount?: number;
  hydrateFormula?: string;
}

export interface SubstanceParticipant {
  coefficient: number;
  formula: string;
  parsed: ParsedFormula;
  raw: string;
}

export interface ParsedEquation {
  raw: string;
  reactants: SubstanceParticipant[];
  products: SubstanceParticipant[];
  isReversible: boolean;
  isValid: boolean;
  error?: string;
}

export interface AtomBalanceRow {
  element: string;
  name: string;
  reactantsCount: number;
  productsCount: number;
  isBalanced: boolean;
}

export interface BalanceResult {
  success: boolean;
  balancedEquation?: string;
  reactantsCoefficients?: number[];
  productsCoefficients?: number[];
  reactants?: SubstanceParticipant[];
  products?: SubstanceParticipant[];
  atomTable?: AtomBalanceRow[];
  isConserved?: boolean;
  explanation?: string;
  error?: string;
}

export type ReactionTypeCategory =
  | 'synthesis'
  | 'decomposition'
  | 'single_replacement'
  | 'double_replacement'
  | 'combustion'
  | 'neutralization'
  | 'precipitation'
  | 'redox'
  | 'gas_formation'
  | 'organic';

export interface ReactionTypeClassification {
  category: ReactionTypeCategory;
  name: string;
  definition: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ReactionClassificationResult {
  classifications: ReactionTypeClassification[];
  explanation: string;
  isChemicallyVerified: boolean;
  characteristics: string[];
}

export interface CatalogSubstance {
  formula: string;
  preferredName: string;
  commonNames: string[];
  description: string;
  molarMass: number;
  substanceType: string;
  composition: ElementCount;
  stateStandard?: StateOfMatter;
  solubilityInWater?: 'soluble' | 'insoluble' | 'slightly_soluble';
  color?: string;
}

export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  category:
    | 'metal'
    | 'nonmetal'
    | 'metalloid'
    | 'noble_gas'
    | 'halogen'
    | 'alkali_metal'
    | 'alkaline_earth_metal'
    | 'transition_metal'
    | 'post_transition_metal'
    | 'lanthanide'
    | 'actinide';
  electronegativity?: number;
  commonOxidationStates?: number[];
  period?: number;
  group?: number;
  electronConfiguration?: string;
}

export interface ElementOxidationState {
  element: string;
  name: string;
  reactantNox: number;
  productNox: number;
  role: 'oxidized' | 'reduced' | 'unchanged';
  electronsDelta: number;
}

export interface RedoxAnalysisResult {
  isRedox: boolean;
  elementStates: ElementOxidationState[];
  oxidizedElement?: string;
  reducedElement?: string;
  reducingAgent?: string;
  oxidizingAgent?: string;
  explanation: string;
}

export interface StoichiometryItem {
  formula: string;
  name: string;
  role: 'reactant' | 'product';
  coefficient: number;
  molarMass: number;
  moles: number;
  massGrams: number;
  isLimiting?: boolean;
  isExcess?: boolean;
  excessRemainingGrams?: number;
}

export interface StoichiometryResult {
  items: StoichiometryItem[];
  limitingReagent?: string;
  excessReagents: string[];
  explanation: string;
}

export interface MassPercentageItem {
  element: string;
  name: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  percentage: number;
}
