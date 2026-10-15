import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReactionGuidePage.css';

interface ReactionTypeGuideItem {
  id: string;
  name: string;
  generalFormula: string;
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
      definition: 'Duas ou mais substâncias se combinam para formar um único produto.',
      exampleReaction: '2 H2 + O2 -> 2 H2O',
      explanation: 'Hidrogênio e oxigênio reagem para formar água.',
      practicalApplication: 'Síntese de amônia no processo Haber-Bosch.'
    },
    {
      id: 'decomposition',
      name: 'Decomposição, Análise ou Pirólise',
      generalFormula: 'AB → A + B',
      definition: 'Um composto se decompõe em substâncias mais simples por aquecimento (pirólise), eletricidade (eletrólise) ou luz (fotólise).',
      exampleReaction: 'CaCO3 -> CaO + CO2',
      explanation: 'Ao ser aquecido, o carbonato de cálcio forma óxido de cálcio e dióxido de carbono.',
      practicalApplication: 'Produção de cal e cimento.'
    },
    {
      id: 'single_replacement',
      name: 'Simples Troca ou Deslocamento',
      generalFormula: 'A + BC → AC + B',
      definition: 'Um elemento substitui outro em um composto quando é mais reativo.',
      exampleReaction: 'Zn + 2 HCl -> ZnCl2 + H2',
      explanation: 'O zinco desloca o hidrogênio do ácido clorídrico.',
      practicalApplication: 'Proteção catódica contra corrosão em navios e dutos.'
    },
    {
      id: 'double_replacement',
      name: 'Dupla Troca ou Metátese',
      generalFormula: 'AB + CD → AD + CB',
      definition: 'Dois compostos trocam íons. A reação costuma ocorrer quando se forma um precipitado, um gás ou água.',
      exampleReaction: 'AgNO3 + NaCl -> AgCl + NaNO3',
      explanation: 'Os íons prata e cloreto formam cloreto de prata, um sólido insolúvel.',
      practicalApplication: 'Floculação no tratamento de água e identificação de íons em solução.'
    },
    {
      id: 'combustion',
      name: 'Combustão Completa e Incompleta',
      generalFormula: 'Combustível + O₂ → CO₂ + H₂O + Calor',
      definition: 'Na presença de oxigênio suficiente, hidrocarbonetos formam CO₂ e água. Com pouco oxigênio, podem formar monóxido de carbono (CO) e carbono (fuligem).',
      exampleReaction: 'CH4 + 2 O2 -> CO2 + 2 H2O',
      explanation: 'O metano reage com oxigênio e libera energia.',
      practicalApplication: 'Motores, geração termoelétrica e cocção de alimentos.'
    },
    {
      id: 'neutralization',
      name: 'Neutralização Ácido-Base',
      generalFormula: 'Ácido + Base → Sal + H₂O',
      definition: 'Em uma neutralização, ácido e base reagem formando água e um sal.',
      exampleReaction: 'HCl + NaOH -> NaCl + H2O',
      explanation: 'Os íons H⁺ do ácido e OH⁻ da base formam água.',
      practicalApplication: 'Correção de acidez e tratamento de efluentes.'
    },
    {
      id: 'redox',
      name: 'Oxirredução (Redox)',
      generalFormula: 'Redutor + Oxidante → Produto Oxidado + Produto Reduzido',
      definition: 'Há transferência de elétrons: uma espécie perde elétrons e outra os recebe.',
      exampleReaction: 'Zn + CuSO4 -> ZnSO4 + Cu',
      explanation: 'O zinco perde elétrons e os íons cobre os recebem.',
      practicalApplication: 'Pilhas, baterias e corrosão.'
    }
  ];

  const handleTestInLab = (equation: string) => {
    navigate(`/?eq=${encodeURIComponent(equation)}`);
  };

  const [lead, ...rest] = reactionTypes;

  return (
    <div className="reaction-guide-page container">
      <header className="folio-header">
        <div>
          <p className="page-kicker">Guia</p>
          <h1 className="guide-title">Tipos de reação</h1>
        </div>
        <p className="guide-subtitle">
          Padrões gerais, um exemplo de cada classe e onde isso aparece fora da lousa.
        </p>
      </header>

      {lead && (
        <article className="guide-lead">
          <code className="guide-lead-formula">{lead.generalFormula}</code>
          <div className="guide-lead-copy">
            <h2>{lead.name}</h2>
            <p>{lead.definition}</p>
            <p className="guide-lead-example">
              <span>Exemplo</span>
              <code>{lead.exampleReaction}</code>
            </p>
            <p>{lead.explanation} Aplicação: {lead.practicalApplication}</p>
            <button
              onClick={() => handleTestInLab(lead.exampleReaction)}
              className="btn btn-primary"
            >
              Abrir no laboratório
            </button>
          </div>
        </article>
      )}

      <div className="guide-index">
        {rest.map(item => (
          <article key={item.id} className="guide-item-card">
            <div className="guide-card-header">
              <h3 className="guide-card-title">{item.name}</h3>
            </div>
            <code className="guide-general-formula">{item.generalFormula}</code>

            <p className="guide-definition">{item.definition}</p>

            <div className="guide-example-box">
              <span className="example-label">Exemplo</span>
              <code className="example-equation">{item.exampleReaction}</code>
              <p className="example-explanation">{item.explanation}</p>
            </div>

            <p className="guide-application-box">
              <strong>Aplicação.</strong> {item.practicalApplication}
            </p>

            <button
              onClick={() => handleTestInLab(item.exampleReaction)}
              className="btn btn-ghost test-lab-btn"
            >
              Testar no laboratório
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};
