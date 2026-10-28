# Completar produtos: implementação e pesquisa

## O que foi entregue

A entrada `H2 + SO4 ->` oferece `H2SO4` com a ação **Montar fórmula**. A aplicação identifica essa operação como montagem formal por contagem de átomos, inclusive quando a equação é reaberta por URL. Não a classifica como comprovação de reação. A prévia visual permite ver a composição antes de aplicar.

Essa distinção é necessária porque sulfato é `SO4²−`, conforme [PubChem](https://pubchem.ncbi.nlm.nih.gov/compound/sulfate). O [NIST](https://webbook.nist.gov/cgi/cbook.cgi?ID=C7664939&Mask=3F90&Units=SI) identifica a fórmula do ácido sulfúrico como H₂SO₄; isso não demonstra uma rota de formação a partir de H₂ e SO₄ neutro.

A montagem exige correspondência exata com a composição de um composto do catálogo. Não substitui produtos já preenchidos. Casos sem correspondência, com cargas explícitas ou composição orgânica contendo C e H são recusados. A contagem atômica não permite escolher conectividade ou isômeros, como define a [IUPAC para isômero](https://goldbook.iupac.org/terms/view/I03289).

Para reações reconhecidas, a ação **Completar e balancear** aplica os produtos e o cálculo exato em um clique. A regra nova cobre um conjunto finito de ácidos e hidróxidos convencionais, com montagem do sal por neutralidade de cargas. As hipóteses aparecem junto à prévia: neutralização total aquosa, oxigênio suficiente na combustão e outras condições identificadas nas regras existentes. Não se presume que toda mistura reage.

## Melhorias prioritárias para trabalho químico

| Prioridade | Recurso a desenvolver | Valor prático e limite |
| --- | --- | --- |
| Alta | Espécies iônicas e equação iônica líquida | Conservar carga elétrica além dos átomos; dissociar somente eletrólitos apropriados e identificar íons espectadores. Evita tratar sulfato como molécula neutra. |
| Alta | Precipitação e resultado “sem reação líquida” | Reusar as regras de solubilidade já existentes. Para decisões quantitativas, pedir concentrações e Ksp em vez de forçar produtos pela simples troca de íons. |
| Alta | Condições e origem da previsão | Mostrar meio, temperatura, concentração e fontes por regra; oferecer alternativas quando as condições mudam os produtos. Não inferir parâmetros ausentes. |
| Média | Rendimento e preparação de soluções | Reusar a calculadora estequiométrica existente para incluir concentração/volume, pureza e rendimento experimental, mantendo unidades e distinguindo rendimento teórico de real. |

Estas prioridades são uma síntese para este projeto, não uma pesquisa de preferência com usuários.

## Fundamento das prioridades

- A [University of Wisconsin — Predicting Exchange Reactions](https://www2.chem.wisc.edu/deptfiles/genchem/netorial/rottosen/tutorial/modules/chemical_reactions/module4_3/4_3_2.htm) explica que a mistura de espécies que permanecem iguais em solução não tem reação líquida. Um produto insolúvel é uma das forças que permitem prever a precipitação.
- O [OpenStax — Classifying Chemical Reactions](https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions) trata neutralizações, precipitações e equações iônicas. Sustenta as regras educacionais limitadas e a próxima etapa de distinguir espécies em solução.
- O [OpenStax — Shifting Equilibria](https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle) discute a influência de temperatura, concentração e pressão no equilíbrio. Catalisadores alteram a velocidade para atingir o equilíbrio, não sua composição de equilíbrio.
- O [OpenStax — Reaction Stoichiometry](https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry) fundamenta as relações de quantidade a partir de equações balanceadas. As conversões devem ampliar o módulo existente, preservando sua base.

## Verificação e direção visual

Direção Framed sheet preservada, seed 1726430351, sem novo sorteio. Fórmulas e partículas reais são a imagem da ferramenta; não há mídia externa ou dados de amostra novos.

Testes cobrem o exemplo solicitado, conservação de átomos, não sobrescrever produtos, abstenção em casos desconhecidos ou ambíguos, cinco novas neutralizações e hipóteses da combustão. A verificação visual e as capturas desta revisão ficam em `.taste-skill/product-completion/`.

## Crítica visual da revisão

ROUND 1
Seen in one second: sugestão estreita no editor e resultado vazio à direita.
Idea (one sentence): mostrar o possível produto antes de preencher a equação.
Live thing: ação de montar ou completar a entrada.
Layout words by section: editor=form / result=empty / suggestion=narrow-panel.
Scores: design 6.5 · usability 7 · creativity 7 · content 8.5 → overall 7.2.
Caps applied: regras de aplicativo; a coluna estreita compromete a leitura da explicação.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Texto comprimido ao lado do botão na captura desktop inicial; mover sugestão para a área do resultado e usar uma coluna.
2. Resultado vazio não explica a sugestão; mostrar a composição com as partículas reais.
3. A ação principal permanece desativada mesmo com uma sugestão; permitir completar também pelo botão do editor.

ROUND 2
Seen in one second: entrada à esquerda, fórmula sugerida e composição à direita.
Idea (one sentence): o usuário confere os produtos e sua base antes de aplicar.
Live thing: prévia molecular esquemática e conclusão em uma ação.
Layout words by section: editor=form / result=preview / composition=paired-particles.
Scores: design 7.8 · usability 8.3 · creativity 7.8 · content 8.5 → overall 8.1.
Caps applied: regras para aplicativos, com animação previamente solicitada pelo usuário.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. A prévia fica abaixo da primeira dobra no celular; o botão de montagem permanece na primeira tela (`mobile-fold.jpg`).
2. A explicação sobre sulfato exige leitura; o título “montagem formal” e o aviso após aplicar mantêm a distinção.
3. A composição não mostra ligações reais; a legenda explicita o modelo esquemático, sem atribuir geometria.

Inspector final da prévia: **0 FAIL, 0 WARN** em 1440, 768 e 390px. Capturas de todas as páginas foram abertas. Build e **65 testes** aprovados. Teste no navegador confirmou o exemplo solicitado, a conclusão de `HBr + Ca(OH)2` com balanceamento e a permanência do aviso ao recarregar. Sem novas imagens externas ou conteúdo de amostra.
