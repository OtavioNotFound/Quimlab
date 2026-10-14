# QuimLab — Simulador Interativo de Reações Químicas

## 1. Visão geral do projeto

Quero desenvolver uma plataforma educacional de química que permita aos usuários montar, visualizar, balancear e compreender equações químicas de maneira interativa.

O projeto começará como um site desenvolvido com React e Vite, utilizando Supabase para persistência de dados e autenticação quando necessário. A arquitetura deverá permitir, futuramente, a criação de um aplicativo mobile com React Native e a adição de uma API própria hospedada no Railway, caso seja necessário.

O objetivo não é apenas criar uma calculadora de equações químicas, mas um simulador didático que explique o que acontece em uma reação, identifique as substâncias e ensine o usuário a reconhecer os diferentes tipos de reações.

### Objetivos principais

- Montar equações químicas a partir de fórmulas de substâncias.
- Balancear equações químicas automaticamente.
- Identificar reagentes e produtos.
- Reconhecer e classificar tipos de reações químicas.
- Identificar substâncias pelas fórmulas químicas.
- Exibir nomes oficiais, nomes usuais e nomes populares das substâncias.
- Explicar o resultado de cada reação em linguagem simples.
- Mostrar a quantidade de átomos de cada elemento antes e depois da reação.
- Oferecer um ambiente visual e interativo para aprender química.
- Permitir salvar equações favoritas e acompanhar o progresso do usuário.
- Manter a lógica química independente da interface para facilitar a futura migração para React Native.

---

## 2. Tecnologias e arquitetura

### Frontend

- **React:** construção da interface e dos componentes interativos.
- **Vite:** ambiente de desenvolvimento e build.
- **TypeScript:** recomendado para reduzir erros e definir os tipos das fórmulas, substâncias e reações.
- **CSS:** interface responsiva, com suporte a tema claro e escuro.
- **React Router:** navegação entre páginas.
- **Lucide React:** ícones da interface.

A interface deve ser organizada em componentes reutilizáveis, evitando concentrar toda a lógica em um único arquivo.

### Banco de dados e serviços

**Supabase**
- PostgreSQL para armazenar substâncias, reações cadastradas, favoritos e histórico.
- Autenticação para contas de usuários, quando implementada.
- Row Level Security (RLS) para proteger os dados.
- Possibilidade de utilizar Supabase Edge Functions para operações que precisem de execução no servidor.

**Railway — etapa futura e opcional**
- Hospedar uma API própria, caso o projeto precise de processamento no servidor, integração com bibliotecas químicas ou tarefas mais complexas.
- Centralizar serviços que não devam ser executados diretamente no navegador.
- Expor endpoints para o futuro aplicativo mobile.

O Railway não é obrigatório para a primeira versão. A arquitetura deve funcionar sem uma API própria, evitando complexidade desnecessária.

### Arquitetura recomendada

Separar o projeto em três camadas:

1. **Interface:** React e Vite.
2. **Motor químico:** parser de fórmulas, balanceador, catálogo de substâncias e classificador de reações.
3. **Persistência e serviços:** Supabase inicialmente; API própria opcional posteriormente.

O motor químico não deve depender de componentes React. Dessa forma, poderá ser reutilizado no futuro aplicativo React Native.

---

## 3. Como o simulador deve funcionar

O usuário deverá poder digitar uma equação química, selecionar substâncias de um catálogo ou montar uma reação por meio de uma interface visual.

Exemplo de entrada:

`H2 + O2 -> H2O`

O sistema deverá:

1. Interpretar as fórmulas químicas.
2. Identificar os elementos presentes.
3. Contar os átomos de cada elemento nos dois lados.
4. Detectar se a equação está balanceada.
5. Calcular os coeficientes necessários.
6. Exibir a equação balanceada.
7. Identificar as substâncias e seus nomes.
8. Classificar a reação quando houver evidências suficientes.
9. Explicar o que ocorreu na reação.
10. Informar se o resultado é conhecido e quimicamente válido nas condições consideradas.

Resultado esperado:

`2 H2 + O2 -> 2 H2O`

**Nomes das substâncias:**
- H₂: hidrogênio molecular.
- O₂: oxigênio molecular.
- H₂O: água.

**Tipo de reação:** síntese ou combinação.

**Explicação:** duas substâncias se combinam para formar água. O balanceamento exige dois mols de H₂ para cada mol de O₂, produzindo dois mols de H₂O.

O sistema deve distinguir entre uma equação matematicamente balanceada e uma reação química que realmente ocorre. Nem toda combinação de fórmulas representa uma reação possível.

---

# 4. Tipos de reações químicas que o simulador deve reconhecer

A classificação deve permitir mais de uma categoria para uma mesma reação. Por exemplo, uma reação pode ser simultaneamente uma combustão, uma reação de oxirredução e uma reação exotérmica.

## 4.1. Síntese, combinação ou adição

**Definição:** duas ou mais substâncias reagem formando um único produto principal.

Forma geral:

`A + B -> AB`

Exemplo:

`2 Na + Cl2 -> 2 NaCl`

Substâncias:
- Na: sódio.
- Cl₂: cloro molecular.
- NaCl: cloreto de sódio.

Explicação: o sódio reage com o cloro, formando cloreto de sódio.

Regra didática: várias substâncias dão origem a um único produto principal.

Observação: em química orgânica, adição também designa uma classe específica de reações em que átomos ou grupos são incorporados a uma molécula, normalmente sobre uma ligação múltipla. Essa classificação não deve ser confundida automaticamente com a síntese inorgânica.

## 4.2. Decomposição, análise ou dissociação térmica

**Definição:** uma substância origina duas ou mais substâncias.

Forma geral:

`AB -> A + B`

Exemplo:

`CaCO3 -> CaO + CO2`

Substâncias:
- CaCO₃: carbonato de cálcio.
- CaO: óxido de cálcio.
- CO₂: dióxido de carbono, também chamado gás carbônico.

Explicação: o carbonato de cálcio se decompõe, quando submetido a condições adequadas, formando óxido de cálcio e dióxido de carbono.

O sistema deve admitir diferentes formas de decomposição, como:
- Decomposição térmica.
- Decomposição por eletrólise.
- Decomposição fotoquímica.

Não se deve presumir que toda decomposição acontece espontaneamente.

## 4.3. Simples troca ou deslocamento

**Definição:** um elemento livre reage com um composto e substitui outro elemento, quando a reação é quimicamente favorável.

Forma geral:

`A + BC -> AC + B`

Exemplo:

`Zn + 2 HCl -> ZnCl2 + H2`

Substâncias:
- Zn: zinco.
- HCl: cloreto de hidrogênio; em solução aquosa, ácido clorídrico.
- ZnCl₂: cloreto de zinco.
- H₂: hidrogênio molecular.

Explicação: o zinco reage com o ácido, formando cloreto de zinco e liberando hidrogênio.

O simulador deverá considerar que nem toda tentativa de troca resulta em reação. Por exemplo, o deslocamento de um metal depende de sua reatividade em relação ao metal presente no composto.

## 4.4. Dupla troca ou metátese

**Definição:** dois compostos trocam íons ou parceiros de combinação.

Forma geral:

`AB + CD -> AD + CB`

Exemplo:

`AgNO3 + NaCl -> AgCl + NaNO3`

Substâncias:
- AgNO₃: nitrato de prata.
- NaCl: cloreto de sódio.
- AgCl: cloreto de prata.
- NaNO₃: nitrato de sódio.

Explicação: os íons se reorganizam e formam cloreto de prata, que é pouco solúvel em água e precipita nessas condições.

O motor deverá diferenciar uma simples reorganização formal de uma reação efetiva. Em solução aquosa, a formação de precipitado, gás ou eletrólito fraco costuma fornecer a força motriz da reação.

## 4.5. Combustão

**Definição:** reação de uma substância com um agente oxidante, geralmente oxigênio, com liberação de energia.

Exemplo de combustão completa do metano:

`CH4 + 2 O2 -> CO2 + 2 H2O`

Substâncias:
- CH₄: metano.
- O₂: oxigênio.
- CO₂: dióxido de carbono ou gás carbônico.
- H₂O: água.

Explicação: o metano reage com o oxigênio, liberando energia e formando dióxido de carbono e água quando a combustão é completa.

O sistema deve distinguir:

**Combustão completa:** para um hidrocarboneto, forma principalmente CO₂ e H₂O quando há oxigênio suficiente.

**Combustão incompleta:** pode produzir CO, carbono sólido (fuligem), água e outros produtos, dependendo das condições.

A formação dos produtos não deve ser determinada apenas pela fórmula do combustível: disponibilidade de oxigênio e condições da reação também importam.

## 4.6. Neutralização ácido-base

**Definição:** um ácido reage com uma base. Em uma neutralização típica entre ácido e base de Arrhenius, ocorre formação de água e, frequentemente, de um sal.

Exemplo:

`HCl + NaOH -> NaCl + H2O`

Substâncias:
- HCl: ácido clorídrico em solução aquosa.
- NaOH: hidróxido de sódio.
- NaCl: cloreto de sódio.
- H₂O: água.

Equação iônica simplificada:

`H+ + OH- -> H2O`

Explicação: os íons H⁺ e OH⁻ formam água. Os outros íons podem permanecer em solução.

O simulador deve reconhecer a neutralização como uma categoria específica, frequentemente associada à dupla troca em exercícios escolares.

## 4.7. Precipitação

**Definição:** reação em solução que produz um sólido pouco solúvel, chamado precipitado.

Exemplo:

`AgNO3 + NaCl -> AgCl(s) + NaNO3`

O símbolo `(s)` indica sólido.

Equação iônica líquida:

`Ag+ + Cl- -> AgCl(s)`

Explicação: os íons prata e cloreto formam cloreto de prata sólido.

O motor deve consultar regras ou dados de solubilidade para identificar precipitados. Não basta trocar os componentes e presumir que um sólido será formado.

## 4.8. Formação de gás

Algumas reações produzem gases que escapam da solução.

Exemplo:

`Na2CO3 + 2 HCl -> 2 NaCl + H2O + CO2`

Substâncias:
- Na₂CO₃: carbonato de sódio.
- HCl: ácido clorídrico em solução.
- NaCl: cloreto de sódio.
- H₂O: água.
- CO₂: dióxido de carbono.

Explicação: o ácido reage com o carbonato, formando inicialmente ácido carbônico, que se decompõe em água e dióxido de carbono.

O sistema poderá reconhecer padrões como:
- Carbonato + ácido: geralmente produz CO₂.
- Bicarbonato + ácido: geralmente produz CO₂.
- Alguns sulfetos + ácidos: podem produzir H₂S.
- Alguns sais de amônio + bases: podem produzir NH₃.

Esses padrões devem ser validados por regras químicas e condições adequadas.

## 4.9. Oxirredução (redox)

**Definição:** reação em que ocorre transferência de elétrons, com mudança nos números de oxidação de pelo menos alguns elementos.

Exemplo:

`Zn + CuSO4 -> ZnSO4 + Cu`

Substâncias:
- Zn: zinco.
- CuSO₄: sulfato de cobre(II).
- ZnSO₄: sulfato de zinco.
- Cu: cobre.

Explicação:
- O zinco é oxidado: seu número de oxidação passa de 0 para +2.
- O cobre(II) é reduzido: seu número de oxidação passa de +2 para 0.

A reação também é classificada como simples troca.

O motor deve tratar oxidação e redução como processos relacionados, identificando alterações nos números de oxidação e, quando possível, exibindo as semirreações.

## 4.10. Reações orgânicas

O projeto deverá ser preparado para incluir categorias específicas de química orgânica.

### Adição

Uma molécula recebe átomos ou grupos, frequentemente pela abertura de uma ligação dupla ou tripla.

Exemplo:

`CH2=CH2 + H2 -> CH3-CH3`

Eteno + hidrogênio → etano.

### Substituição

Um átomo ou grupo é substituído por outro.

Exemplo:

`CH4 + Cl2 -> CH3Cl + HCl`

Metano + cloro → clorometano + cloreto de hidrogênio.

Essa reação requer condições apropriadas, como luz, para ocorrer de maneira representativa.

### Eliminação

Uma molécula perde átomos ou grupos, formando frequentemente uma ligação múltipla.

Exemplo:

`CH3CH2OH -> CH2=CH2 + H2O`

Etanol → eteno + água.

A transformação requer condições adequadas, como aquecimento e um agente desidratante, conforme o método utilizado.

### Esterificação

Um ácido carboxílico reage com um álcool, formando éster e água em condições apropriadas.

Exemplo:

`CH3COOH + C2H5OH <-> CH3COOC2H5 + H2O`

Ácido acético + etanol ⇌ acetato de etila + água.

A seta dupla indica uma reação reversível em equilíbrio.

O reconhecimento completo de reações orgânicas exigirá conhecimento estrutural das moléculas e não deverá ser baseado apenas na contagem de átomos.

---

# 5. Balanceamento automático de equações químicas

O balanceador será uma das funções centrais do projeto.

## 5.1. Regra fundamental

Uma equação química deve conservar o número de átomos de cada elemento. Em equações iônicas, também deve conservar a carga elétrica.

O balanceamento modifica os coeficientes colocados antes das fórmulas, não os índices internos das substâncias.

Exemplo incorreto:

`H2 + O2 -> H2O2`

Essa alteração muda a substância formada: H₂O₂ é peróxido de hidrogênio, não água.

Exemplo correto:

`2 H2 + O2 -> 2 H2O`

## 5.2. Funcionalidades do balanceador

- Aceitar equações não balanceadas.
- Detectar fórmulas inválidas ou desconhecidas.
- Contar os átomos de cada elemento.
- Exibir uma tabela de contagem antes e depois.
- Encontrar coeficientes inteiros positivos.
- Simplificar os coeficientes para a menor proporção inteira.
- Verificar a conservação da massa.
- Considerar a conservação de carga em equações iônicas.
- Sinalizar equações impossíveis de balancear com as espécies fornecidas.
- Diferenciar uma equação balanceada de uma reação quimicamente validada.
- Permitir que o usuário balanceie manualmente, recebendo dicas.

## 5.3. Algoritmo recomendado

O balanceamento deve utilizar um algoritmo matemático, não apenas uma IA generativa.

Procedimento sugerido:

1. Fazer o parsing de todas as fórmulas.
2. Construir uma lista de elementos presentes.
3. Criar uma matriz de composição, com uma coluna por substância e uma linha por elemento.
4. Atribuir sinais positivos aos reagentes e negativos aos produtos, ou vice-versa, de maneira consistente.
5. Resolver o sistema homogêneo de equações lineares.
6. Encontrar uma solução não nula com coeficientes inteiros positivos.
7. Reduzir os coeficientes ao menor conjunto inteiro.
8. Validar novamente os átomos e as cargas.

A abordagem pode usar álgebra linear, frações exatas e algoritmos de busca inteira. Não utilizar arredondamentos de ponto flutuante como único método de balanceamento.

Algumas equações admitem mais de uma solução matemática ou exigem restrições adicionais. O motor deve detectar ambiguidades e não afirmar que qualquer solução formal corresponde necessariamente a uma reação real.

## 5.4. Exemplo visual

Entrada:

`Fe + O2 -> Fe2O3`

Saída:

`4 Fe + 3 O2 -> 2 Fe2O3`

Tabela de átomos:

| Elemento | Reagentes | Produtos |
|---|---:|---:|
| Fe | 4 | 4 |
| O | 6 | 6 |

Resultado: equação balanceada.

---

# 6. Identificação automática de substâncias

Quando o usuário inserir uma fórmula, o sistema deverá consultar um catálogo químico e retornar as informações disponíveis.

Exemplo:

Entrada: `CO2`

Resultado:

- **Fórmula:** CO₂.
- **Nome recomendado:** dióxido de carbono.
- **Nome usual:** gás carbônico.
- **Classificação:** substância composta; óxido de não metal.
- **Elementos presentes:** carbono e oxigênio.
- **Composição:** 1 átomo de carbono e 2 átomos de oxigênio por unidade molecular.
- **Massa molar aproximada:** 44,01 g/mol.
- **Descrição:** gás incolor nas condições ambientes, importante em processos como respiração e combustão.

Outro exemplo:

Entrada: `NaCl`

- **Nome:** cloreto de sódio.
- **Nome usual:** sal de cozinha, quando se refere ao uso alimentar.
- **Elementos:** sódio e cloro.
- **Proporção:** 1:1.
- **Tipo de composto:** sal iônico.
- **Massa molar aproximada:** 58,44 g/mol.

Outro exemplo:

Entrada: `H2O`

- **Nome:** água.
- **Fórmula:** H₂O.
- **Elementos:** hidrogênio e oxigênio.
- **Proporção:** 2:1.
- **Massa molar aproximada:** 18,015 g/mol.

## 6.1. Regras de nomenclatura

O sistema deverá dar preferência a nomes químicos padronizados e manter nomes usuais como sinônimos.

Exemplos:
- CO₂: dióxido de carbono; gás carbônico.
- CO: monóxido de carbono.
- NaCl: cloreto de sódio; sal de cozinha em contexto cotidiano.
- HCl: cloreto de hidrogênio; ácido clorídrico quando em solução aquosa.
- NH₃: amônia.
- H₂SO₄: ácido sulfúrico.
- NaOH: hidróxido de sódio; soda cáustica em contexto usual.
- CaCO₃: carbonato de cálcio.
- H₂O₂: peróxido de hidrogênio; água oxigenada em contexto comercial.

**Importante:** o sistema não deve confundir nomes de substâncias diferentes nem tratar nomes populares como universais em todos os contextos.

A nomenclatura não deve ser implementada apenas por regras textuais improvisadas. Utilizar um catálogo de substâncias validado, com fórmulas, nomes, sinônimos, composição, estado físico quando conhecido e propriedades relevantes.

---

# 7. Interface do simulador

A interface deve ser moderna, limpa, responsiva e adequada tanto a computadores quanto a dispositivos móveis.

## 7.1. Página inicial

Elementos:
- Nome e identidade visual do QuimLab.
- Campo para pesquisar substâncias ou equações.
- Botão para abrir o simulador.
- Acesso às categorias de reações.
- Exemplos de equações.
- Área de exercícios e desafios.
- Histórico recente, quando o usuário estiver autenticado.

## 7.2. Laboratório virtual

A tela principal deverá ter:

- Campo para inserir uma equação química.
- Área para montar reagentes e produtos.
- Botão de balanceamento automático.
- Botão para verificar a equação.
- Botão para limpar a experiência.
- Painel com os nomes das substâncias.
- Painel com o tipo de reação.
- Tabela de átomos.
- Explicação didática.
- Avisos de fórmulas desconhecidas ou resultados não validados.

Exemplo de visualização:

**Reagentes**

`H₂ + O₂`

↓

**Balanceamento automático**

`2 H₂ + O₂`

↓

**Produtos**

`2 H₂O`

**Resultado:** síntese.

**Explicação:** os átomos de hidrogênio e oxigênio se reorganizam para formar moléculas de água.

A representação deve deixar claro que as setas representam transformações químicas, e não necessariamente etapas temporais de um mecanismo molecular.

## 7.3. Editor visual

Como evolução, permitir que o usuário selecione substâncias em um painel e as arraste para o lado dos reagentes ou produtos.

Funcionalidades:
- Pesquisa por nome ou fórmula.
- Catálogo de substâncias.
- Inserção de coeficientes.
- Visualização de índices subscritos.
- Remoção e substituição de substâncias.
- Balanceamento automático.
- Avisos quando a reação não estiver validada.

O editor deve funcionar também com teclado e em telas pequenas, sem depender exclusivamente de arrastar elementos.

## 7.4. Animações e visualizações

As animações devem ser didáticas e não comprometer a precisão científica.

Exemplos:
- Contagem visual dos átomos.
- Comparação dos reagentes com os produtos.
- Destaque para os coeficientes alterados.
- Representações de moléculas.
- Formação de precipitados em reações conhecidas.
- Liberação de gás em reações conhecidas.
- Mudança de estado físico quando pertinente.

O sistema deve diferenciar representações esquemáticas de simulações físicas reais. Não prometer prever velocidade de reação, temperatura, rendimento ou mecanismos detalhados sem um modelo apropriado.

---

# 8. Organização sugerida do projeto

```text
quimlab/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── EquationEditor/
│   │   ├── FormulaDisplay/
│   │   ├── SubstanceCard/
│   │   ├── ReactionBadge/
│   │   ├── AtomCounter/
│   │   └── ExplanationPanel/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── SimulatorPage.tsx
│   │   ├── ReactionsPage.tsx
│   │   ├── SubstancePage.tsx
│   │   └── HistoryPage.tsx
│   ├── chemistry/
│   │   ├── parser.ts
│   │   ├── formulaParser.ts
│   │   ├── equationParser.ts
│   │   ├── balancer.ts
│   │   ├── atomCounter.ts
│   │   ├── substanceCatalog.ts
│   │   ├── nomenclature.ts
│   │   ├── reactionClassifier.ts
│   │   ├── solubility.ts
│   │   └── validator.ts
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── substancesService.ts
│   │   └── reactionsService.ts
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── main.tsx
├── supabase/
│   └── migrations/
├── tests/
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

A estrutura é uma sugestão inicial. O agente poderá ajustar a organização, desde que mantenha a separação entre interface, motor químico e persistência.

---

# 9. Banco de dados Supabase

O banco deverá ser estruturado para evitar duplicações e permitir expansão futura.

## 9.1. Tabela `substances`

Campos sugeridos:

- `id`: identificador.
- `formula`: fórmula química normalizada.
- `preferred_name`: nome recomendado.
- `common_names`: nomes usuais.
- `description`: descrição didática.
- `molar_mass`: massa molar.
- `composition`: composição por elemento.
- `substance_type`: classificação química.
- `metadata`: propriedades adicionais validadas.
- `created_at`: data de criação.

A fórmula normalizada deverá possuir uma estratégia de unicidade que evite duplicações acidentais.

## 9.2. Tabela `reactions`

Campos sugeridos:

- `id`: identificador.
- `name`: nome descritivo.
- `equation`: equação normalizada.
- `reaction_types`: lista de classificações.
- `explanation`: explicação didática.
- `conditions`: condições necessárias, quando conhecidas.
- `validation_status`: estado de validação.
- `source_reference`: referência da informação química.
- `created_at`: data de criação.

## 9.3. Tabela `reaction_substances`

Relacionamento entre reações e substâncias.

Campos:
- `reaction_id`.
- `substance_id`.
- `role`: reagente ou produto.
- `coefficient`.
- `position`.

Essa estrutura permite que uma reação tenha múltiplos reagentes e produtos.

## 9.4. Tabela `user_favorites`

Campos:
- `id`.
- `user_id`.
- `reaction_id`.
- `created_at`.

O usuário deverá acessar apenas seus próprios favoritos.

## 9.5. Tabela `user_history`

Campos:
- `id`.
- `user_id`.
- `input_equation`.
- `balanced_equation`.
- `result_status`.
- `created_at`.

Não salvar informações pessoais desnecessárias. Aplicar políticas RLS às tabelas que contenham dados particulares.

## 9.6. Segurança

- A chave `service_role` do Supabase nunca deve ser exposta no frontend.
- A chave pública `anon` ou publishable pode ser usada no cliente, com RLS configurada corretamente.
- Operações privilegiadas devem ocorrer em ambiente confiável no servidor.
- Variáveis de ambiente devem ser separadas por ambiente.
- O projeto deve incluir instruções de configuração sem credenciais reais no repositório.

---

# 10. API futura no Railway

A API própria deverá ser opcional e adicionada quando houver uma necessidade concreta.

Possíveis endpoints:

```text
GET  /api/substances?query=CO2
GET  /api/substances/CO2
POST /api/equations/balance
POST /api/equations/validate
POST /api/reactions/classify
GET  /api/reactions?type=combustion
GET  /api/health
```

Exemplo de solicitação de balanceamento:

```json
{
  "equation": "H2 + O2 -> H2O"
}
```

Exemplo de resposta:

```json
{
  "input": "H2 + O2 -> H2O",
  "balanced": "2 H2 + O2 -> 2 H2O",
  "balancedStatus": true,
  "validationStatus": "balanced",
  "reactionTypes": ["synthesis"],
  "substances": [
    {
      "formula": "H2",
      "name": "hidrogênio"
    },
    {
      "formula": "O2",
      "name": "oxigênio"
    },
    {
      "formula": "H2O",
      "name": "água"
    }
  ]
}
```

Os estados de validação devem ser definidos com precisão. Uma equação balanceada não significa automaticamente que a reação foi confirmada experimentalmente.

A API deverá validar entradas, limitar o tamanho das solicitações, tratar erros e evitar executar código arbitrário enviado pelo usuário.

---

# 11. Estratégia para o catálogo químico

O catálogo de substâncias é essencial para reconhecer fórmulas e apresentar nomenclaturas confiáveis.

O projeto deverá separar:

1. **Parser químico:** interpreta a fórmula e calcula sua composição.
2. **Catálogo de substâncias:** relaciona fórmulas a substâncias conhecidas.
3. **Mecanismo de nomenclatura:** fornece nomes segundo regras reconhecidas.
4. **Base de reações conhecidas:** armazena equações validadas e condições.
5. **Classificador:** aplica regras para sugerir categorias de reação.

O parser pode interpretar fórmulas como:

- `H2O`
- `CO2`
- `Ca(OH)2`
- `Al2(SO4)3`
- `CuSO4·5H2O`

Deve suportar índices, parênteses, colchetes quando pertinentes, hidratos, cargas iônicas e estados físicos em etapas progressivas.

A nomenclatura automática de compostos arbitrários é um problema mais complexo do que simplesmente reconhecer símbolos. Portanto, o MVP deve consultar um catálogo validado e identificar claramente quando uma substância não for reconhecida.

Fontes de dados a avaliar:
- PubChem para informações sobre substâncias e sinônimos.
- Bases educacionais e referências de química inorgânica.
- Tabelas de solubilidade e séries de reatividade.
- Referências de nomenclatura química reconhecidas.

Antes de importar dados em massa, verificar as licenças, a atribuição exigida e a adequação de cada fonte.

---

# 12. Testes e validação

A precisão química deve ser uma prioridade do projeto.

## Testes do parser

- Fórmulas simples.
- Fórmulas com parênteses.
- Fórmulas com vários elementos.
- Índices ausentes ou inválidos.
- Cargas iônicas.
- Estados físicos.
- Hidratos.

## Testes do balanceador

- Equações já balanceadas.
- Equações não balanceadas.
- Reações com três ou mais elementos.
- Reações com vários reagentes e produtos.
- Equações iônicas.
- Equações com coeficientes mínimos diferentes de 1.
- Equações inválidas ou sem solução apropriada.

## Testes do classificador

- Síntese.
- Decomposição.
- Simples troca.
- Dupla troca.
- Combustão.
- Neutralização.
- Precipitação.
- Oxirredução.
- Reações orgânicas.

O sistema deve admitir múltiplas classificações e permitir o resultado "classificação inconclusiva" quando faltarem informações.

## Testes de segurança

- Fórmulas malformadas.
- Entradas excessivamente grandes.
- Acesso indevido ao histórico de outros usuários.
- Falta de autenticação em operações privadas.
- Tentativas de inserir dados inválidos no catálogo.

---

# 13. Etapas de desenvolvimento

## Fase 1 — MVP funcional

Prioridade máxima:

- Criar o projeto React + Vite + TypeScript.
- Criar a interface inicial.
- Implementar o parser de fórmulas.
- Implementar o contador de átomos.
- Implementar o balanceador automático.
- Reconhecer fórmulas de um catálogo inicial.
- Exibir nomes e sinônimos conhecidos.
- Implementar síntese, decomposição, simples troca e dupla troca.
- Adicionar combustão e neutralização para os padrões suportados.
- Criar testes automatizados.
- Exibir mensagens de erro claras.

O motor deverá funcionar localmente, sem exigir a criação de uma API própria.

## Fase 2 — Banco de dados

- Configurar o Supabase.
- Criar as tabelas e migrações.
- Importar um catálogo inicial validado.
- Salvar favoritos e histórico.
- Implementar autenticação, se necessária.
- Configurar políticas RLS.

## Fase 3 — Experiência educacional

- Criar páginas explicativas para cada tipo de reação.
- Adicionar exemplos resolvidos.
- Exibir contagem de átomos em tempo real.
- Implementar exercícios de balanceamento.
- Adicionar dicas graduais.
- Mostrar erros comuns e explicar como corrigi-los.

## Fase 4 — Recursos avançados

- Classificação de oxirredução.
- Regras de solubilidade.
- Reconhecimento de formação de gases.
- Reações orgânicas.
- Equações iônicas.
- Estados físicos e condições de reação.
- Animações e representações moleculares.
- API própria no Railway, caso necessária.

## Fase 5 — Aplicativo mobile

- Reutilizar a lógica química em um pacote independente.
- Desenvolver a interface com React Native.
- Reutilizar os serviços e o modelo de dados.
- Integrar o Supabase.
- Utilizar a API própria apenas se houver necessidade.
- Adaptar navegação, acessibilidade e interação para telas móveis.

---

# 14. Requisitos de qualidade

O projeto deve seguir os seguintes princípios:

- TypeScript com tipagem consistente.
- Componentes pequenos e reutilizáveis.
- Separação entre lógica química e interface.
- Testes automatizados para os algoritmos centrais.
- Tratamento de erros sem travar a aplicação.
- Interface responsiva.
- Acessibilidade para teclado e leitores de tela.
- Tema claro e escuro.
- Dados químicos com referências e origem documentadas.
- Nenhuma promessa de certeza quando o sistema não puder validar uma reação.
- Nenhuma dependência obrigatória de uma IA generativa para executar o balanceamento.
- Nenhuma chave secreta no frontend.
- Documentação para instalação, desenvolvimento e implantação.
- Arquitetura preparada para React Native.

---

# 15. Critérios de conclusão do MVP

A primeira versão será considerada funcional quando:

1. O usuário puder inserir uma equação química.
2. O sistema interpretar as fórmulas suportadas.
3. O balanceador gerar coeficientes corretos para os casos suportados.
4. A contagem de átomos confirmar a conservação dos elementos.
5. O catálogo identificar substâncias conhecidas e seus sinônimos.
6. O classificador reconhecer os tipos de reação implementados.
7. A interface explicar o resultado em linguagem acessível.
8. Fórmulas inválidas ou desconhecidas gerarem mensagens compreensíveis.
9. Testes automatizados cobrirem os principais casos.
10. O projeto puder ser executado localmente e implantado como site.
11. O Supabase puder ser conectado sem expor credenciais privadas.
12. A lógica química puder ser reutilizada sem depender de componentes React.

---

# 16. Instrução final para o agente de programação

Desenvolva o QuimLab de forma incremental, começando por um MVP funcional, e não tente implementar todos os recursos simultaneamente.

Antes de criar funcionalidades avançadas, implemente e teste o parser de fórmulas, o contador de átomos e o balanceador. Esses componentes são a base de todo o simulador.

Não invente regras químicas para preencher lacunas. Quando uma equação não puder ser validada com os dados e regras disponíveis, informe a limitação ao usuário.

Priorize a precisão matemática, a consistência química, a clareza das explicações e a facilidade de manutenção do código.

Não implemente apenas uma interface visual com resultados simulados ou fixos. Os cálculos devem funcionar de verdade.

Comece com o React + Vite + TypeScript, um motor químico independente e um conjunto pequeno de substâncias e reações testadas. Depois expanda o catálogo, integre o Supabase e prepare os recursos necessários para a futura versão mobile.

O resultado desejado é um laboratório virtual de química que ensine o usuário a compreender as reações, e não apenas a copiar equações prontas.
