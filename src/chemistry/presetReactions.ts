export interface PresetReaction {
  id: string;
  name: string;
  unbalanced: string;
  balanced: string;
  category: string;
  description: string;
  didacticTips: string;
}

export const PRESET_REACTIONS: PresetReaction[] = [
  {
    id: 'synthesis-water',
    name: 'Síntese da Água',
    unbalanced: 'H2 + O2 -> H2O',
    balanced: '2 H2 + O2 -> 2 H2O',
    category: 'Síntese / Combustão',
    description: 'Combinação violenta e altamente energética entre os gases hidrogênio e oxigênio molecular.',
    didacticTips: 'Observe que são necessárias 2 moléculas diatômicas de H₂ para cada 1 de O₂, gerando 2 moléculas de H₂O.'
  },
  {
    id: 'synthesis-salt',
    name: 'Síntese do Sal de Cozinha',
    unbalanced: 'Na + Cl2 -> NaCl',
    balanced: '2 Na + Cl2 -> 2 NaCl',
    category: 'Síntese / Oxirredução',
    description: 'Reação vigorosa entre o metal alcalino sódio e o gás cloro tóxico, gerando o inofensivo sal de cozinha.',
    didacticTips: 'O sódio doa um elétron para o cloro, formando uma ligação iônica cristalina estável.'
  },
  {
    id: 'decomp-calcite',
    name: 'Decomposição Térmica do Calcário (Calcinação)',
    unbalanced: 'CaCO3 -> CaO + CO2',
    balanced: 'CaCO3 -> CaO + CO2',
    category: 'Decomposição',
    description: 'Aquecimento do carbonato de cálcio a mais de 800°C gerando cal virgem e desprendimento de gás carbônico.',
    didacticTips: 'Esta equação já se encontra naturalmente balanceada na proporção estequiométrica 1:1:1.'
  },
  {
    id: 'decomp-peroxide',
    name: 'Decomposição da Água Oxigenada',
    unbalanced: 'H2O2 -> H2O + O2',
    balanced: '2 H2O2 -> 2 H2O + O2',
    category: 'Decomposição / Redox',
    description: 'Dismutação do peróxido de hidrogênio em água e gás oxigênio livre, catalisada pela luz ou peroxidase.',
    didacticTips: 'O oxigênio no peróxido tem Nox -1, sofrendo oxidação a O₂ (Nox 0) e redução a H₂O (Nox -2) simultaneamente.'
  },
  {
    id: 'combustion-methane',
    name: 'Combustão Completa do Metano',
    unbalanced: 'CH4 + O2 -> CO2 + H2O',
    balanced: 'CH4 + 2 O2 -> CO2 + 2 H2O',
    category: 'Combustão',
    description: 'Queima do gás natural com oxigênio abundante liberando luz, calor e dióxido de carbono.',
    didacticTips: 'Primeiro balanceie o carbono (1:1), depois o hidrogênio (4 nos reagentes -> 2 H₂O), e por fim ajuste o oxigênio.'
  },
  {
    id: 'combustion-ethanol',
    name: 'Combustão do Etanol (Álcool Combustível)',
    unbalanced: 'C2H5OH + O2 -> CO2 + H2O',
    balanced: 'C2H5OH + 3 O2 -> 2 CO2 + 3 H2O',
    category: 'Combustão',
    description: 'Reação utilizada nos motores a biocombustível automotivo com liberação de energia mecânica.',
    didacticTips: 'Atenção ao oxigênio que já existe na molécula de etanol ao fazer a contagem dos reagentes!'
  },
  {
    id: 'neutralization-basic',
    name: 'Neutralização Ácido-Base Clássica',
    unbalanced: 'HCl + NaOH -> NaCl + H2O',
    balanced: 'HCl + NaOH -> NaCl + H2O',
    category: 'Neutralização / Dupla Troca',
    description: 'Ácido clorídrico neutralizado por hidróxido de sódio gerando sal de cozinha em solução neutra.',
    didacticTips: 'O próton H⁺ do ácido combina-se com a hidroxila OH⁻ da base, formando a molécula de água.'
  },
  {
    id: 'single-replacement-zinc',
    name: 'Deslocamento de Hidrogênio pelo Zinco',
    unbalanced: 'Zn + HCl -> ZnCl2 + H2',
    balanced: 'Zn + 2 HCl -> ZnCl2 + H2',
    category: 'Simples Troca / Redox',
    description: 'Ataque de ácido a metal não nobre liberando gás hidrogênio que entra em ebulição e pode ser inflamado.',
    didacticTips: 'O zinco metálico tem maior potencial de oxidação que o hidrogênio, substituindo-o na ligação com o cloro.'
  },
  {
    id: 'single-replacement-copper',
    name: 'Deslocamento de Cobre por Zinco Metálico',
    unbalanced: 'Zn + CuSO4 -> ZnSO4 + Cu',
    balanced: 'Zn + CuSO4 -> ZnSO4 + Cu',
    category: 'Simples Troca / Redox',
    description: 'Mergulho de uma placa de zinco em solução azul de sulfato cúprico, depositando cobre metálico avermelhado.',
    didacticTips: 'A solução perde a cor azul (Cu²⁺) à medida que os íons Zn²⁺ incolores tomam seu lugar.'
  },
  {
    id: 'precipitation-silver',
    name: 'Precipitação do Cloreto de Prata',
    unbalanced: 'AgNO3 + NaCl -> AgCl + NaNO3',
    balanced: 'AgNO3 + NaCl -> AgCl + NaNO3',
    category: 'Dupla Troca / Precipitação',
    description: 'Mistura de duas soluções límpidas que instantaneamente formam uma nuvem branca insolúvel de AgCl.',
    didacticTips: 'O cloreto de prata possui produto de solubilidade (Ksp) baixíssimo, precipitando imediatamente do meio aquoso.'
  },
  {
    id: 'oxidation-rust',
    name: 'Oxidação do Ferro (Formação da Ferrugem)',
    unbalanced: 'Fe + O2 -> Fe2O3',
    balanced: '4 Fe + 3 O2 -> 2 Fe2O3',
    category: 'Síntese / Oxirredução',
    description: 'Corrosão lenta do ferro exposto ao oxigênio e umidade atmosférica formando hematita avermelhada.',
    didacticTips: 'Note a proporção de 4 átomos de ferro reagindo com 3 moléculas de oxigênio diatômico (6 átomos de oxigênio).'
  },
  {
    id: 'gas-formation-carbonate',
    name: 'Efervescência de Bicarbonato com Ácido',
    unbalanced: 'NaHCO3 + HCl -> NaCl + H2O + CO2',
    balanced: 'NaHCO3 + HCl -> NaCl + H2O + CO2',
    category: 'Dupla Troca / Formação de Gás',
    description: 'Reação efervescente típica de antiácidos e vulcões de feira de ciências com desprendimento borbulhante de CO₂.',
    didacticTips: 'O ácido carbônico (H₂CO₃) formado como intermediário é instável e decompõe-se espontaneamente em H₂O e CO₂.'
  },
  {
    id: 'cellular-respiration',
    name: 'Respiração Celular (Oxidação da Glicose)',
    unbalanced: 'C6H12O6 + O2 -> CO2 + H2O',
    balanced: 'C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O',
    category: 'Combustão Bioquímica / Redox',
    description: 'Processo metabólico aeróbio central em que as células dos seres vivos obtêm ATP a partir da glicose.',
    didacticTips: '1 mol de glicose consome 6 mols de oxigênio molecular, produzindo 6 mols de CO₂ e 6 mols de água.'
  },
  {
    id: 'precipitation-aluminum',
    name: 'Floculação com Sulfato de Alumínio',
    unbalanced: 'Al2(SO4)3 + Ca(OH)2 -> Al(OH)3 + CaSO4',
    balanced: 'Al2(SO4)3 + 3 Ca(OH)2 -> 2 Al(OH)3 + 3 CaSO4',
    category: 'Dupla Troca / Precipitação',
    description: 'Reação fundamental usada no saneamento e tratamento de água para coagular impurezas.',
    didacticTips: 'O hidróxido de alumínio forma um floco gelatinoso pesado que arrasta impurezas em suspensão para o fundo do tanque.'
  }
];
