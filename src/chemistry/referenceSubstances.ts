import { parseFormula } from './formulaParser';
import { getAllElements } from './periodicTable';
import { CatalogSubstance, StateOfMatter } from './types';

type ReferenceRow = [formula: string, name: string, type: string, state?: StateOfMatter];

const ROWS: ReferenceRow[] = [
  // Ácidos e bases
  ['HF', 'Ácido fluorídrico', 'Hidrácido'], ['HBr', 'Ácido bromídrico', 'Hidrácido'],
  ['HI', 'Ácido iodídrico', 'Hidrácido'], ['HCN', 'Ácido cianídrico', 'Hidrácido'],
  ['HClO', 'Ácido hipocloroso', 'Oxiácido'], ['HClO2', 'Ácido cloroso', 'Oxiácido'],
  ['HClO3', 'Ácido clórico', 'Oxiácido'], ['HClO4', 'Ácido perclórico', 'Oxiácido'],
  ['H2SO3', 'Ácido sulfuroso', 'Oxiácido'], ['HNO2', 'Ácido nitroso', 'Oxiácido'],
  ['H3BO3', 'Ácido bórico', 'Oxiácido'], ['H2CO3', 'Ácido carbônico', 'Oxiácido'],
  ['H2CrO4', 'Ácido crômico', 'Oxiácido'], ['H2Cr2O7', 'Ácido dicrômico', 'Oxiácido'],
  ['HMnO4', 'Ácido permangânico', 'Oxiácido'], ['H3AsO4', 'Ácido arsênico', 'Oxiácido'],
  ['H3AsO3', 'Ácido arsenioso', 'Oxiácido'], ['H2SiO3', 'Ácido silícico', 'Oxiácido'],
  ['LiOH', 'Hidróxido de lítio', 'Base inorgânica', 's'], ['RbOH', 'Hidróxido de rubídio', 'Base inorgânica', 's'],
  ['CsOH', 'Hidróxido de césio', 'Base inorgânica', 's'], ['Ba(OH)2', 'Hidróxido de bário', 'Base inorgânica', 's'],
  ['Sr(OH)2', 'Hidróxido de estrôncio', 'Base inorgânica', 's'], ['Fe(OH)2', 'Hidróxido de ferro(II)', 'Base inorgânica', 's'],
  ['Fe(OH)3', 'Hidróxido de ferro(III)', 'Base inorgânica', 's'], ['Cu(OH)2', 'Hidróxido de cobre(II)', 'Base inorgânica', 's'],
  ['Zn(OH)2', 'Hidróxido de zinco', 'Base anfótera', 's'], ['Cr(OH)3', 'Hidróxido de cromo(III)', 'Base anfótera', 's'],

  // Óxidos, peróxidos e hidretos
  ['Li2O', 'Óxido de lítio', 'Óxido básico', 's'], ['Na2O', 'Óxido de sódio', 'Óxido básico', 's'],
  ['K2O', 'Óxido de potássio', 'Óxido básico', 's'], ['BeO', 'Óxido de berílio', 'Óxido anfótero', 's'],
  ['MgO', 'Óxido de magnésio', 'Óxido básico', 's'], ['SrO', 'Óxido de estrôncio', 'Óxido básico', 's'],
  ['BaO', 'Óxido de bário', 'Óxido básico', 's'], ['B2O3', 'Óxido de boro', 'Óxido ácido', 's'],
  ['SiO2', 'Dióxido de silício', 'Óxido ácido', 's'], ['P4O6', 'Trióxido de fósforo', 'Óxido ácido', 's'],
  ['P4O10', 'Pentóxido de fósforo', 'Óxido ácido', 's'], ['Cl2O', 'Monóxido de dicloro', 'Óxido ácido'],
  ['Cl2O7', 'Heptóxido de dicloro', 'Óxido ácido'], ['N2O3', 'Trióxido de dinitrogênio', 'Óxido ácido'],
  ['N2O5', 'Pentóxido de dinitrogênio', 'Óxido ácido'], ['FeO', 'Óxido de ferro(II)', 'Óxido básico', 's'],
  ['Fe3O4', 'Óxido de ferro(II,III)', 'Óxido misto', 's'], ['Cu2O', 'Óxido de cobre(I)', 'Óxido básico', 's'],
  ['ZnO', 'Óxido de zinco', 'Óxido anfótero', 's'], ['Cr2O3', 'Óxido de cromo(III)', 'Óxido anfótero', 's'],
  ['CrO3', 'Trióxido de cromo', 'Óxido ácido', 's'], ['MnO2', 'Dióxido de manganês', 'Óxido', 's'],
  ['Mn2O7', 'Heptóxido de dimanganês', 'Óxido ácido'], ['PbO', 'Óxido de chumbo(II)', 'Óxido anfótero', 's'],
  ['PbO2', 'Óxido de chumbo(IV)', 'Óxido anfótero', 's'], ['SnO', 'Óxido de estanho(II)', 'Óxido anfótero', 's'],
  ['SnO2', 'Óxido de estanho(IV)', 'Óxido anfótero', 's'], ['Ag2O', 'Óxido de prata(I)', 'Óxido básico', 's'],
  ['Na2O2', 'Peróxido de sódio', 'Peróxido', 's'], ['BaO2', 'Peróxido de bário', 'Peróxido', 's'],
  ['KO2', 'Superóxido de potássio', 'Superóxido', 's'], ['LiH', 'Hidreto de lítio', 'Hidreto', 's'],
  ['NaH', 'Hidreto de sódio', 'Hidreto', 's'], ['CaH2', 'Hidreto de cálcio', 'Hidreto', 's'],
  ['SiH4', 'Silano', 'Hidreto covalente', 'g'], ['PH3', 'Fosfina', 'Hidreto covalente', 'g'],

  // Sais halogenados
  ['LiF', 'Fluoreto de lítio', 'Sal halogenado', 's'], ['KF', 'Fluoreto de potássio', 'Sal halogenado', 's'],
  ['CaF2', 'Fluoreto de cálcio', 'Sal halogenado', 's'], ['MgF2', 'Fluoreto de magnésio', 'Sal halogenado', 's'],
  ['AlF3', 'Fluoreto de alumínio', 'Sal halogenado', 's'], ['AgF', 'Fluoreto de prata', 'Sal halogenado', 's'],
  ['LiCl', 'Cloreto de lítio', 'Sal halogenado', 's'], ['MgCl2', 'Cloreto de magnésio', 'Sal halogenado', 's'],
  ['AlCl3', 'Cloreto de alumínio', 'Sal halogenado', 's'], ['FeCl2', 'Cloreto de ferro(II)', 'Sal halogenado', 's'],
  ['FeCl3', 'Cloreto de ferro(III)', 'Sal halogenado', 's'], ['CuCl', 'Cloreto de cobre(I)', 'Sal halogenado', 's'],
  ['CuCl2', 'Cloreto de cobre(II)', 'Sal halogenado', 's'], ['AgCl', 'Cloreto de prata', 'Sal halogenado', 's'],
  ['PbCl2', 'Cloreto de chumbo(II)', 'Sal halogenado', 's'], ['SnCl2', 'Cloreto de estanho(II)', 'Sal halogenado', 's'],
  ['SnCl4', 'Cloreto de estanho(IV)', 'Sal halogenado'], ['CoCl2', 'Cloreto de cobalto(II)', 'Sal halogenado', 's'],
  ['NiCl2', 'Cloreto de níquel(II)', 'Sal halogenado', 's'], ['KBr', 'Brometo de potássio', 'Sal halogenado', 's'],
  ['NaBr', 'Brometo de sódio', 'Sal halogenado', 's'], ['CaBr2', 'Brometo de cálcio', 'Sal halogenado', 's'],
  ['AgBr', 'Brometo de prata', 'Sal halogenado', 's'], ['KI', 'Iodeto de potássio', 'Sal halogenado', 's'],
  ['NaI', 'Iodeto de sódio', 'Sal halogenado', 's'], ['CaI2', 'Iodeto de cálcio', 'Sal halogenado', 's'],
  ['AgI', 'Iodeto de prata', 'Sal halogenado', 's'], ['CuI', 'Iodeto de cobre(I)', 'Sal halogenado', 's'],

  // Nitratos, sulfatos, carbonatos e fosfatos
  ['LiNO3', 'Nitrato de lítio', 'Sal oxigenado', 's'], ['Ca(NO3)2', 'Nitrato de cálcio', 'Sal oxigenado', 's'],
  ['Mg(NO3)2', 'Nitrato de magnésio', 'Sal oxigenado', 's'], ['Ba(NO3)2', 'Nitrato de bário', 'Sal oxigenado', 's'],
  ['Al(NO3)3', 'Nitrato de alumínio', 'Sal oxigenado', 's'], ['Cu(NO3)2', 'Nitrato de cobre(II)', 'Sal oxigenado', 's'],
  ['Fe(NO3)3', 'Nitrato de ferro(III)', 'Sal oxigenado', 's'], ['Pb(NO3)2', 'Nitrato de chumbo(II)', 'Sal oxigenado', 's'],
  ['AgNO2', 'Nitrito de prata', 'Sal oxigenado', 's'], ['NaNO2', 'Nitrito de sódio', 'Sal oxigenado', 's'],
  ['KNO2', 'Nitrito de potássio', 'Sal oxigenado', 's'], ['Li2SO4', 'Sulfato de lítio', 'Sal oxigenado', 's'],
  ['K2SO4', 'Sulfato de potássio', 'Sal oxigenado', 's'], ['MgSO4', 'Sulfato de magnésio', 'Sal oxigenado', 's'],
  ['BaSO4', 'Sulfato de bário', 'Sal oxigenado', 's'], ['FeSO4', 'Sulfato de ferro(II)', 'Sal oxigenado', 's'],
  ['Fe2(SO4)3', 'Sulfato de ferro(III)', 'Sal oxigenado', 's'], ['CuSO4', 'Sulfato de cobre(II)', 'Sal oxigenado', 's'],
  ['Ag2SO4', 'Sulfato de prata', 'Sal oxigenado', 's'], ['PbSO4', 'Sulfato de chumbo(II)', 'Sal oxigenado', 's'],
  ['Na2SO3', 'Sulfito de sódio', 'Sal oxigenado', 's'], ['K2SO3', 'Sulfito de potássio', 'Sal oxigenado', 's'],
  ['CaSO3', 'Sulfito de cálcio', 'Sal oxigenado', 's'], ['Na2S2O3', 'Tiossulfato de sódio', 'Sal oxigenado', 's'],
  ['K2S2O3', 'Tiossulfato de potássio', 'Sal oxigenado', 's'], ['Li2CO3', 'Carbonato de lítio', 'Sal oxigenado', 's'],
  ['K2CO3', 'Carbonato de potássio', 'Sal oxigenado', 's'], ['MgCO3', 'Carbonato de magnésio', 'Sal oxigenado', 's'],
  ['BaCO3', 'Carbonato de bário', 'Sal oxigenado', 's'], ['FeCO3', 'Carbonato de ferro(II)', 'Sal oxigenado', 's'],
  ['CuCO3', 'Carbonato de cobre(II)', 'Sal oxigenado', 's'], ['Na3PO4', 'Fosfato de sódio', 'Sal oxigenado', 's'],
  ['K3PO4', 'Fosfato de potássio', 'Sal oxigenado', 's'], ['Ca3(PO4)2', 'Fosfato de cálcio', 'Sal oxigenado', 's'],
  ['Mg3(PO4)2', 'Fosfato de magnésio', 'Sal oxigenado', 's'], ['AlPO4', 'Fosfato de alumínio', 'Sal oxigenado', 's'],
  ['NH4H2PO4', 'Fosfato monoamônico', 'Sal ácido', 's'], ['(NH4)2HPO4', 'Fosfato diamônico', 'Sal ácido', 's'],

  // Outros sais e compostos inorgânicos
  ['Na2S', 'Sulfeto de sódio', 'Sal binário', 's'], ['K2S', 'Sulfeto de potássio', 'Sal binário', 's'],
  ['FeS', 'Sulfeto de ferro(II)', 'Sal binário', 's'], ['FeS2', 'Dissulfeto de ferro', 'Sal binário', 's'],
  ['CuS', 'Sulfeto de cobre(II)', 'Sal binário', 's'], ['ZnS', 'Sulfeto de zinco', 'Sal binário', 's'],
  ['PbS', 'Sulfeto de chumbo(II)', 'Sal binário', 's'], ['CdS', 'Sulfeto de cádmio', 'Sal binário', 's'],
  ['Al2S3', 'Sulfeto de alumínio', 'Sal binário', 's'], ['CaC2', 'Carbeto de cálcio', 'Carbeto', 's'],
  ['SiC', 'Carbeto de silício', 'Carbeto', 's'], ['Al4C3', 'Carbeto de alumínio', 'Carbeto', 's'],
  ['NaCN', 'Cianeto de sódio', 'Sal binário', 's'], ['KCN', 'Cianeto de potássio', 'Sal binário', 's'],
  ['KClO3', 'Clorato de potássio', 'Sal oxigenado', 's'], ['NaClO', 'Hipoclorito de sódio', 'Sal oxigenado'],
  ['Ca(ClO)2', 'Hipoclorito de cálcio', 'Sal oxigenado', 's'], ['KClO4', 'Perclorato de potássio', 'Sal oxigenado', 's'],
  ['Na2CrO4', 'Cromato de sódio', 'Sal oxigenado', 's'], ['K2CrO4', 'Cromato de potássio', 'Sal oxigenado', 's'],
  ['K2Cr2O7', 'Dicromato de potássio', 'Sal oxigenado', 's'], ['Na2B4O7', 'Tetraborato de sódio', 'Sal oxigenado', 's'],
  ['Na2SiO3', 'Silicato de sódio', 'Sal oxigenado', 's'], ['CaSiO3', 'Silicato de cálcio', 'Sal oxigenado', 's'],

  // Moléculas simples e compostos moleculares
  ['F2', 'Flúor molecular', 'Substância simples', 'g'], ['Br2', 'Bromo molecular', 'Substância simples', 'l'],
  ['I2', 'Iodo molecular', 'Substância simples', 's'], ['O3', 'Ozônio', 'Substância simples', 'g'],
  ['P4', 'Fósforo molecular', 'Substância simples', 's'], ['S8', 'Enxofre molecular', 'Substância simples', 's'],
  ['CS2', 'Dissulfeto de carbono', 'Composto molecular', 'l'], ['CCl4', 'Tetracloreto de carbono', 'Composto molecular', 'l'],
  ['SF6', 'Hexafluoreto de enxofre', 'Composto molecular', 'g'], ['BF3', 'Trifluoreto de boro', 'Composto molecular', 'g'],
  ['BCl3', 'Tricloreto de boro', 'Composto molecular', 'g'], ['PCl3', 'Tricloreto de fósforo', 'Composto molecular', 'l'],
  ['PCl5', 'Pentacloreto de fósforo', 'Composto molecular', 's'], ['SiCl4', 'Tetracloreto de silício', 'Composto molecular', 'l'],
  ['SOCl2', 'Cloreto de tionila', 'Composto molecular', 'l'], ['COCl2', 'Cloreto de carbonila', 'Composto molecular', 'g'],

  // Hidrocarbonetos e aromáticos
  ['C4H10', 'Butano', 'Hidrocarboneto (alcano)', 'g'], ['C5H12', 'Pentano', 'Hidrocarboneto (alcano)', 'l'],
  ['C6H14', 'Hexano', 'Hidrocarboneto (alcano)', 'l'], ['C7H16', 'Heptano', 'Hidrocarboneto (alcano)', 'l'],
  ['C8H18', 'Octano', 'Hidrocarboneto (alcano)', 'l'], ['C9H20', 'Nonano', 'Hidrocarboneto (alcano)', 'l'],
  ['C10H22', 'Decano', 'Hidrocarboneto (alcano)', 'l'], ['C3H6', 'Propeno', 'Hidrocarboneto (alceno)', 'g'],
  ['C4H8', 'Buteno', 'Hidrocarboneto (alceno)', 'g'], ['C5H10', 'Penteno', 'Hidrocarboneto (alceno)', 'l'],
  ['C6H12', 'Hexeno', 'Hidrocarboneto (alceno)', 'l'], ['C3H4', 'Propino', 'Hidrocarboneto (alcino)', 'g'],
  ['C4H6', 'Butino', 'Hidrocarboneto (alcino)', 'g'], ['C6H6', 'Benzeno', 'Hidrocarboneto aromático', 'l'],
  ['C7H8', 'Tolueno', 'Hidrocarboneto aromático', 'l'], ['C8H10', 'Etilbenzeno', 'Hidrocarboneto aromático', 'l'],
  ['C10H8', 'Naftaleno', 'Hidrocarboneto aromático', 's'], ['C14H10', 'Antraceno', 'Hidrocarboneto aromático', 's'],
  ['C14H10', 'Fenantreno', 'Hidrocarboneto aromático', 's'], ['C6H12', 'Ciclohexano', 'Hidrocarboneto cíclico', 'l'],

  // Álcoois, éteres, aldeídos, cetonas e ácidos orgânicos
  ['C3H8O', 'Propan-1-ol', 'Composto orgânico (álcool)', 'l'], ['C3H8O', 'Propan-2-ol', 'Composto orgânico (álcool)', 'l'],
  ['C4H10O', 'Butan-1-ol', 'Composto orgânico (álcool)', 'l'], ['C5H12O', 'Pentan-1-ol', 'Composto orgânico (álcool)', 'l'],
  ['C6H14O', 'Hexan-1-ol', 'Composto orgânico (álcool)', 'l'], ['C2H6O2', 'Etilenoglicol', 'Composto orgânico (diol)', 'l'],
  ['C3H8O3', 'Glicerol', 'Composto orgânico (triol)', 'l'], ['C6H6O', 'Fenol', 'Composto orgânico (fenol)', 's'],
  ['C2H6O', 'Éter dimetílico', 'Composto orgânico (éter)', 'g'], ['C4H10O', 'Éter dietílico', 'Composto orgânico (éter)', 'l'],
  ['CH2O', 'Metanal', 'Composto orgânico (aldeído)', 'g'], ['C2H4O', 'Etanal', 'Composto orgânico (aldeído)', 'l'],
  ['C3H6O', 'Propanona', 'Composto orgânico (cetona)', 'l'], ['C4H8O', 'Butanona', 'Composto orgânico (cetona)', 'l'],
  ['CH2O2', 'Ácido fórmico', 'Ácido carboxílico', 'l'], ['C2H4O2', 'Ácido acético', 'Ácido carboxílico', 'l'],
  ['C3H6O2', 'Ácido propiônico', 'Ácido carboxílico', 'l'], ['C4H8O2', 'Ácido butírico', 'Ácido carboxílico', 'l'],
  ['C2H2O4', 'Ácido oxálico', 'Ácido dicarboxílico', 's'], ['C3H4O4', 'Ácido malônico', 'Ácido dicarboxílico', 's'],
  ['C4H6O4', 'Ácido succínico', 'Ácido dicarboxílico', 's'], ['C6H8O7', 'Ácido cítrico', 'Ácido tricarboxílico', 's'],
  ['C3H6O3', 'Ácido lático', 'Ácido carboxílico', 'l'], ['C7H6O2', 'Ácido benzoico', 'Ácido carboxílico', 's'],
  ['C9H8O4', 'Ácido acetilsalicílico', 'Composto orgânico (ácido)', 's'],

  // Ésteres, aminas, amidas e biomoléculas comuns
  ['C3H6O2', 'Etanoato de metila', 'Composto orgânico (éster)', 'l'],
  ['C4H8O2', 'Etanoato de etila', 'Composto orgânico (éster)', 'l'],
  ['CH3NO', 'Formamida', 'Composto orgânico (amida)', 'l'], ['C2H5NO', 'Acetamida', 'Composto orgânico (amida)', 's'],
  ['CH5N', 'Metilamina', 'Composto orgânico (amina)', 'g'], ['C2H7N', 'Etilamina', 'Composto orgânico (amina)', 'g'],
  ['C6H7N', 'Anilina', 'Composto orgânico (amina)', 'l'], ['CH4N2O', 'Ureia', 'Composto orgânico (amida)', 's'],
  ['C5H5N', 'Piridina', 'Composto heterocíclico', 'l'], ['C4H5N', 'Pirrol', 'Composto heterocíclico', 'l'],
  ['C6H12O6', 'Frutose', 'Carboidrato (monossacarídeo)', 's'], ['C12H22O11', 'Sacarose', 'Carboidrato (dissacarídeo)', 's'],
  ['C12H22O11', 'Lactose', 'Carboidrato (dissacarídeo)', 's'], ['C12H22O11', 'Maltose', 'Carboidrato (dissacarídeo)', 's'],
  ['C5H10O5', 'Ribose', 'Carboidrato (monossacarídeo)', 's'], ['C5H10O4', 'Desoxirribose', 'Carboidrato (monossacarídeo)', 's'],
  ['C2H5NO2', 'Glicina', 'Aminoácido', 's'], ['C3H7NO2', 'Alanina', 'Aminoácido', 's'],
  ['C3H7NO3', 'Serina', 'Aminoácido', 's'], ['C5H9NO4', 'Ácido glutâmico', 'Aminoácido', 's'],
  ['C6H9N3O2', 'Histidina', 'Aminoácido', 's'], ['C9H11NO3', 'Tirosina', 'Aminoácido', 's'],
  ['C8H10N4O2', 'Cafeína', 'Alcaloide', 's'], ['C8H9NO2', 'Paracetamol', 'Composto orgânico', 's'],
  ['C13H18O2', 'Ibuprofeno', 'Composto orgânico', 's'], ['C8H8O3', 'Vanilina', 'Composto orgânico', 's']
];

const makeReference = ([formula, preferredName, substanceType, stateStandard]: ReferenceRow, index: number): CatalogSubstance => {
  const parsed = parseFormula(formula);
  return {
    id: `reference-${index}-${formula}-${preferredName}`,
    formula,
    preferredName,
    commonNames: [],
    description: `Entrada de referência para ${preferredName}, com composição e massa molar calculadas pelo QuimLab.`,
    molarMass: parsed.molarMass,
    substanceType,
    composition: parsed.elements,
    stateStandard,
    catalogGroup: 'reference'
  };
};

const elementReferences: CatalogSubstance[] = getAllElements().map(element => ({
  id: `element-${element.atomicNumber}`,
  formula: element.symbol,
  preferredName: element.name,
  commonNames: [],
  description: `Substância elementar de número atômico ${element.atomicNumber}.`,
  molarMass: element.atomicMass,
  substanceType: `Substância simples (${element.category.replaceAll('_', ' ')})`,
  composition: { [element.symbol]: 1 },
  catalogGroup: 'reference'
}));

export const REFERENCE_SUBSTANCES: CatalogSubstance[] = [
  ...elementReferences,
  ...ROWS.map(makeReference)
];
