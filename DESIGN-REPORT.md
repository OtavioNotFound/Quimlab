# QuimLab — reformulação da interface

## Revisão da paleta e movimento

A pedido do usuário, a paleta azul foi substituída por sálvia e neutros no tema claro, com superfícies de carvão esverdeado no escuro. O painel da reação, os controles e seus textos agora têm tokens próprios por tema; antes, o modo escuro herdava o campo azul do claro. Os seletores nativos acompanham o tema por `color-scheme`.

As entradas usam uma curva de desaceleração única e pequenos intervalos entre elementos. Fórmulas entram na ordem reagentes → produtos quando o resultado muda, inclusive no ajuste manual. Navegação, ícone do tema, expansão de detalhes, hover e pressão de botões têm feedback próprio. A troca de tema interpola superfícies e texto; `prefers-reduced-motion` remove todas as animações e transições. Nenhuma biblioteca foi adicionada.

Esta revisão substitui as escolhas de cor azul descritas no registro original abaixo, preservado como histórico do trabalho.

Direção da skill design-taste-frontend: **Dressed as something else**, seed **1063905262**. Categoria emprestada: exposição científica. Tipografia sorteada: Bodoni Moda + Jost; paleta: Sky and navy. Sem novo sorteio.

## Conceito e aplicação

As equações calculadas pelo QuimLab tornam-se o objeto exposto sobre uma bancada azul. O editor ocupa uma superfície branca contígua; os resultados, a conservação e as fichas mantêm uma leitura independente. A interação central é a própria equação: exemplos, entrada livre, balanceamento, ajuste manual e visualizações existentes.

Inventário do projeto: cálculo com frações exatas; 14 reações de partida; conservação de átomos; massas molares; modelos moleculares; estequiometria; números de oxidação; catálogo de substâncias; 118 elementos; desafios; histórico; favoritos. Nenhuma prova social, imagem de produto ou estatística comercial foi inventada.

Argumento da interface: escrever uma reação → observar sua proporção → conferir a conservação → estudar as substâncias. Texto principal: “Balancear equações”. Apoio: “Toda reação tem uma proporção. Explore os reagentes, encontre o equilíbrio e veja o que se conserva.” Ação: “Balancear equação”. Os conteúdos científicos existentes foram mantidos.

O escopo é um aplicativo, explicitamente fora do alvo principal da skill (landing pages). Foram aplicadas sua direção, tipografia, campos de cor, hierarquia, revisão por screenshots e redução de ornamentos. A escala e o ritmo foram adaptados para manter as ferramentas acessíveis. O azul concentra-se no resultado para evitar que todas as superfícies funcionais disputem atenção. O laranja da ação foi escurecido para contraste com texto branco; no tema escuro, o texto do botão é escuro.

Não foram adicionadas fotografias, vídeos, imagens externas nem conteúdo de amostra. Não há créditos de mídia pendentes. Os modelos moleculares e as cores de categorias científicas existentes foram preservados. A entrada da bancada usa transformações e opacidade, com alternativa sem animação para prefers-reduced-motion.

## Alterações

- Navegação compacta, com links que se reorganizam no celular, identificação da página ativa e alternância de tema.
- Editor e resultado lado a lado no desktop; composição vertical no celular, incluindo seta vertical entre reagentes e produtos.
- Ferramentas existentes mantidas; classificação disponível no expansor “Entender esta reação”.
- Estado vazio/entrada inválida, foco visível e ajuda para digitar a equação.
- Catálogo com busca destacada, filtros que quebram linha e fichas alternadas por fundo.
- Guia e desafios com o mesmo campo azul para fórmulas e controles maiores nos desafios.
- Tabela periódica integrada ao sistema visual sem alterar a organização ou os dados previamente modificados pelo usuário.
- Rodapé com assinatura ampliada e contraste nos dois temas.
- Troca de rota volta ao início; marcadores de negrito das explicações são apresentados como ênfase, sem HTML injetado.

## Verificação

- `npm run build`: passou, incluindo TypeScript.
- `npm test`: 35 testes passaram, em 3 arquivos.
- `git diff --check`: sem erros de whitespace na revisão.
- Navegador real: ferro balanceado como 4 Fe + 3 O2 → 2 Fe2O3; validação manual correta; abertura do montador visual; abas moléculas, estequiometria e redox; busca NaCl; desafio de água com pontuação 10; pesquisa e ficha do ferro; envio de elemento ao simulador; histórico; exemplo de combustão do metano; entrada inválida desabilita balanceamento; tema escuro.
- Screenshots: 1440, 768 e 390 px em `.taste-skill/final-inspect/`.

Não foi feita uma auditoria completa de acessibilidade de todos os diálogos nem validação remota dos serviços de persistência. O motor químico e os serviços não foram alterados nesta reformulação.

## Crítica visual

ROUND 1
Seen in one second: formulário dividido por linhas, sem hierarquia clara entre entrada e saída.
Idea (one sentence): a proporção química precisa ocupar o centro visual da bancada.
Live thing: simulador existente.
Layout words by section: header=split / editor=linear / result=linear / details=list.
Scores: design 5.5 · usability 6.5 · creativity 5 · content 8 → overall 6.0.
Caps applied: falhas do inspetor, três famílias tipográficas, texto pequeno e ausência de imagens.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Primeira dobra original: ferramentas e resultado no mesmo plano. Separar editor e resultado por superfícies.
2. Primeira dobra original: muitas regras e rótulos pequenos. Remover divisórias decorativas e ampliar texto.
3. Mobile original: navegação e abas horizontais. Permitir quebra de linha e controles em duas colunas.

ROUND 2
Seen in one second: resultado sobre uma superfície azul ao lado do editor.
Idea (one sentence): a equação calculada vira o objeto exposto na bancada do QuimLab.
Live thing: equação editável com balanço real.
Layout words by section: header=split / workspace=paired-surfaces / conservation=table / explanation=text / substances=list.
Scores: design 6.5 · usability 8 · creativity 7 · content 8 → arithmetic 7.25; strict skill score 6.0.
Caps applied: o inspetor continua reprovando quantidade de fotografias, escala de pôster e o título do resultado interpretado como eyebrow. A nota formal permanece limitada a 6.0; não se declara aprovação integral da skill.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Mobile, resultado: seta ao lado dos reagentes enquanto produto quebra linha. Composição vertical com seta para baixo.
2. Desktop, explicação: marcadores ** apareciam literalmente. Renderizar os trechos como strong.
3. Captura do guia após navegação: página abria no ponto de rolagem anterior. Restaurar início ao trocar de rota.

Os três problemas da segunda rodada foram corrigidos. Permanecem adaptações intencionais: conteúdo científico em vez de fotografias decorativas, hierarquia de aplicação em vez de título de pôster e rótulo explícito para identificar o resultado. O relatório bruto do inspetor e seus avisos foram preservados, sem exceções que escondam resultados. O lint textual também acusa convenções de tabelas e componentes científicos legados; referências ao token font-mono resolvem agora para a fonte Jost, não para uma terceira família.
