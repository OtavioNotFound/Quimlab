# Interface simplificada

Direção Framed sheet preservada, seed 1726430351, sem novo sorteio, novas dependências ou mudanças no motor químico.

A bancada destaca entrada, ação principal, resultado e átomos. Ajuda foi agrupada em Ferramentas. A tabela de conservação, as explicações e as fichas continuam disponíveis em expansores identificados. As abas Moléculas, Estequiometria e Redox permanecem visíveis. Descrições e nomes alternativos dos cartões de substâncias ficam em Detalhes, inclusive no catálogo. Não foram removidos os dados dessas descrições.

Foram mantidos autocomplete, exemplos, completar produtos, montagem formal, animação e pausa, destaque por elemento, montador, modo manual, tabela periódica, favoritos, histórico, cópia e LaTeX. O aviso que distingue montagem formal de reação real continua visível. Os nomes e rótulos repetidos foram encurtados.

No mesmo exemplo `H2 + O -> H2O`, o texto visível de main caiu de 351 para 145 palavras na primeira revisão (59%). Depois a ajuda foi movida para dentro de Ferramentas. Esses números descrevem somente esse exemplo e estado inicial, não todos os conteúdos do projeto.

Verificação final: build aprovado, 65 testes aprovados, lint dos três componentes sem falhas ou avisos, diff sem erros de whitespace. Inspector da versão de produção local: 0 FAIL e 0 WARN em 1440, 768 e 390px. Todas as capturas finais foram abertas. As tentativas iniciais de inspeção tiveram timeout e uma captura intermediária teve aviso de fontes externas; a execução final carregou as fontes existentes e passou.

O controle interativo do navegador perdeu a conexão ao tentar abrir expansores. Não se declara uma nova passagem manual completa por todos os menus. Os expansores usam details/summary nativos e os handlers das funcionalidades existentes foram preservados.

ROUND 1
Seen in one second: editor, composição e vários blocos de leitura ao mesmo tempo.
Idea (one sentence): mostrar a tarefa primeiro e oferecer a explicação quando solicitada.
Live thing: equação editável, autocomplete e átomos.
Layout words by section: editor=form / result=particles / analyses=expanded-text.
Scores: design 7.5 · usability 6.8 · creativity 7.5 · content 8.5 → overall 7.6.
Caps applied: regras de aplicativo; excesso de leitura identificado pelo usuário e professor.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. A tabela e fichas ocupam a tela mesmo sem consulta; colocá-las em expansores.
2. Frases de ajuda e legendas repetem instruções; manter os textos completos em ajuda opcional.
3. A prévia repete botões e títulos; manter a ação no editor e uma identificação breve no resultado.

ROUND 2
Seen in one second: equação e bancada de átomos, com análises compactas abaixo.
Idea (one sentence): a interface mostra o resultado e deixa cada explicação ao alcance de um expansor.
Live thing: mesmas funções químicas, com leitura opcional.
Layout words by section: editor=compact-form / result=particles / analyses=disclosures.
Scores: design 8 · usability 8.4 · creativity 7.8 · content 8.5 → overall 8.2.
Caps applied: regras para aplicativos; sem mídia ou conteúdo de amostra novo.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. No celular, o editor precede a composição; o atalho Ver átomos permanece disponível.
2. Explicações precisam de um clique adicional; os resumos identificam o conteúdo.
3. Fichas dentro da seção de substâncias precisam de outro clique para texto completo; fórmula, nome e massa molar permanecem visíveis.

Sem novas imagens externas, créditos de mídia ou conteúdo de amostra.
