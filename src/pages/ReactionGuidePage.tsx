import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Flame, Droplets, Zap, Sparkles } from 'lucide-react';
import './ReactionGuidePage.css';

interface ReactionTypeGuideItem {
  id: string;
  name: string;
  generalFormula: string;
  icon: any;
  colorClass: string;
  definition: string;
  exampleReaction: string;
  explanation: string;
  practicalApplication: string;
}

export const ReactionGuidePage: React.FC = () => {
  const navigate = useNavigate();

  const reactionTypes: ReactionTypeGuideItem[] = [
    {
      id: 'synthesis',
      name: 'Síntese, Combinação ou Adição',
      generalFormula: 'A + B → AB',
      icon: Sparkles,
      colorClass: 'color-blue',
      definition: 'Processo no qual duas ou mais substâncias reagentes simples ou compostas unem-se para formar um único produto com estrutura molecular ou reticular mais complexa.',
      exampleReaction: '2 H2 + O2 -> 2 H2O',
      explanation: 'O hidrogênio e o oxigênio diatômicos combinam-se com violenta liberação de energia gerando água pura.',
      practicalApplication: 'Produção em larga escala de amônia (fertilizantes) pelo processo Haber-Bosch.'
    },
    {
      id: 'decomposition',
      name: 'Decomposição, Análise ou Pirólise',
      generalFormula: 'AB → A + B',
      icon: Layers,
      colorClass: 'color-purple',
      definition: 'Transformação na qual uma única substância composta se fragmenta por aquecimento (pirólise), eletricidade (eletrólise) ou luz (fotólise), originando duas ou mais substâncias mais simples.',
      exampleReaction: 'CaCO3 -> CaO + CO2',
      explanation: 'O calcário aquecido a altas temperaturas decompõe-se liberando cal virgem e gás carbônico.',
      practicalApplication: 'Fabricação de cimento e fabricação de cal para argamassa na construção civil.'
    },
    {
      id: 'single_replacement',
      name: 'Simples Troca ou Deslocamento',
      generalFormula: 'A + BC → AC + B',
      icon: Zap,
      colorClass: 'color-amber',
      definition: 'Uma substância simples reage com uma substância composta, onde o elemento livre mais reativo desloca o elemento menos reativo da substância composta.',
      exampleReaction: 'Zn + 2 HCl -> ZnCl2 + H2',
      explanation: 'O metal zinco desloca os íons hidrogênio da solução de ácido clorídrico, borbulhando gás hidrogênio.',
      practicalApplication: 'Proteção galvânica catódica contra ferrugem e corrosão de navios e dutos.'
    },
    {
      id: 'double_replacement',
      name: 'Dupla Troca ou Metátese',
      generalFormula: 'AB + CD → AD + CB',
      icon: Droplets,
      colorClass: 'color-cyan',
      definition: 'Dois compostos (usualmente sais, ácidos ou bases em solução aquosa) permutam seus cátions e ânions, impulsionados pela formação de um precipitado, gás ou eletrólito fraco.',
      exampleReaction: 'AgNO3 + NaCl -> AgCl + NaNO3',
      explanation: 'A mistura dos sais límpidos precipita instantaneamente o cloreto de prata como um sólido insolúvel branco.',
      practicalApplication: 'Tratamento de água (floculação) e análise química qualitativa de íons em laboratório.'
    },
    {
      id: 'combustion',
      name: 'Combustão Completa e Incompleta',
      generalFormula: 'Combustível + O₂ → CO₂ + H₂O + Calor',
      icon: Flame,
      colorClass: 'color-rose',
      definition: 'Reação redox altamente exotérmica entre um combustível e um comburente (oxigênio). Se houver oxigênio suficiente forma-se CO₂ e H₂O; com oxigênio escasso, produz-se o perigoso monóxido de carbono (CO) e fuligem (C).',
      exampleReaction: 'CH4 + 2 O2 -> CO2 + 2 H2O',
      explanation: 'O gás metano queima liberando energia mecânica e térmica.',
      practicalApplication: 'Geração termoelétrica, motores veiculares e cocção de alimentos.'
    },
    {
      id: 'neutralization',
      name: 'Neutralização Ácido-Base',
      generalFormula: 'Ácido + Base → Sal + H₂O',
      icon: Droplets,
      colorClass: 'color-emerald',
      definition: 'Reação estequiométrica em que os íons hidrogênio H⁺ de um ácido combinam-se com os íons hidróxido OH⁻ de uma base para produzir moléculas de água e um sal neutro ou hidrolisável.',
      exampleReaction: 'HCl + NaOH -> NaCl + H2O',
      explanation: 'O ácido clorídrico e a soda cáustica neutralizam suas propriedades cáusticas extremas formando salmoura neutra.',
      practicalApplication: 'Antiácidos estomacais e neutralização de solos agrícolas ácidos com calcário.'
    },
    {
      id: 'redox',
      name: 'Oxirredução (Redox)',
      generalFormula: 'Redutor + Oxidante → Produto Oxidado + Produto Reduzido',
      icon: Zap,
      colorClass: 'color-amber',
      definition: 'Reações químicas fundamentais caracterizadas pela transferência de elétrons, onde o redutor se oxida (aumenta o Nox) e o oxidante se reduz (diminui o Nox).',
      exampleReaction: 'Zn + CuSO4 -> ZnSO4 + Cu',
      explanation: 'O zinco perde 2 elétrons oxidando para Zn²⁺, enquanto o cobre Cu²⁺ ganha 2 elétrons reduzindo a cobre metálico.',
      practicalApplication: 'Pilhas, baterias recarregáveis de lítio e proteção contra ferrugem.'
    }
  ];

  const handleTestInLab = (equation: string) => {
    navigate(`/?eq=${encodeURIComponent(equation)}`);
  };

  return (
    <div className="reaction-guide-page container">
      <div className="guide-hero">
        <div className="badge badge-purple">
          <Layers size={14} />
          <span>Guia Teórico e Didático</span>
        </div>
        <h1 className="guide-title">Classificação das Reações Químicas</h1>
        <p className="guide-subtitle">
          Entenda as regras fundamentais que regem as transformações da matéria segundo os padrões didáticos da química moderna.
        </p>
      </div>

      <div className="guide-cards-grid">
        {reactionTypes.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="guide-item-card card">
              <div className="guide-card-header">
                <div className={`guide-icon-box ${item.colorClass}`}>
                  <Icon size={22} />
                </div>
                <div className="guide-header-text">
                  <h3 className="guide-card-title">{item.name}</h3>
                  <code className="guide-general-formula">{item.generalFormula}</code>
                </div>
              </div>

              <p className="guide-definition">{item.definition}</p>

              <div className="guide-example-box">
                <span className="example-label">Exemplo representativo:</span>
                <code className="example-equation">{item.exampleReaction}</code>
                <p className="example-explanation">{item.explanation}</p>
              </div>

              <div className="guide-application-box">
                <strong>Aplicação prática:</strong> {item.practicalApplication}
              </div>

              <button
                onClick={() => handleTestInLab(item.exampleReaction)}
                className="btn btn-secondary test-lab-btn"
              >
                <span>Simular no Laboratório</span>
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
