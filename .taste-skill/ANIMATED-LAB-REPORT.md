# QuimLab: partículas e entrada assistida

Continuação local em 28/10/2026. Direção preservada: **Framed sheet**, seed **1726430351**, sem novo sorteio. A moldura sálvia e a tipografia Jost continuam; o conteúdo científico dá identidade à bancada.

A pergunta principal é: quais átomos entram e saem desta reação? A interação central combina comparação entre entrada e resultado, destaque por elemento e partículas com movimento suave. A animação foi solicitada pelo usuário, além do padrão de movimento apenas em controles da skill para aplicativos.

## Entrega

- Movimento em SVG por transformações CSS, com botão para pausar e retomar. A pausa permanece ao editar a equação. A preferência por movimento reduzido elimina animações e o controle correspondente.
- Destaque de hidrogênio, oxigênio ou qualquer elemento da reação pelos controles de conservação. Os demais átomos ficam discretos; contagens e fórmulas continuam completas.
- Autocomplete na equação e no campo de fórmula do montador. Aceita fórmulas, nomes e nomes comuns sem exigir acentos. A seleção substitui apenas a substância junto ao cursor e preserva coeficientes e outras partes da equação.
- Sugestões limitadas a seis, navegação com setas, confirmação com Enter, fechamento com Escape e seleção por toque. A entrada livre continua disponível.
- Sugestões nativas na tabela periódica e busca por nome sem acentos.
- Atalho “Ver átomos”, com destino abaixo da navegação fixa, para chegar à composição diretamente no celular.

A representação mostra uma unidade por substância com seu multiplicador; limita a doze esferas por unidade e informa átomos adicionais. Não estima ligações, geometria molecular ou velocidade de reação. Não foram incluídas fotografias, bibliotecas, serviços externos ou dados de amostra. Não há créditos de mídia pendentes.

## Verificação

- Build TypeScript/Vite e 55 testes aprovados.
- Testes novos cobrem nomes, aliases, acentos, seleção no meio da equação, coeficientes, delimitadores, fórmulas repetidas e limite de sugestões.
- Navegador: substituição de `H2 + oxigenio` por `H2 + O2`, seleção de NaCl no montador, setas/Enter/Escape, pausa efetiva da animação e destaque de oxigênio.
- Celular: seleção por toque e menu dentro dos 390px; atalho posiciona a composição a 72px do topo, sem overflow horizontal.
- Inspector final: **0 FAIL, 0 WARN** em 1440, 768 e 390px. Relatório em `animated-lab/report.json`.
- Movimento reduzido em 390px: **0 FAIL, 0 WARN**, zero elementos animados. Relatório em `animated-reduced/report.json`.
- Lint dos novos componentes: zero falhas; um aviso de sombra, permitido por ser o menu flutuante de sugestões.

As sugestões da tabela periódica usam o datalist nativo; sua apresentação depende do navegador. Não foi feita auditoria de todas as rotas ou persistência remota. Vercel ficou fora desta continuação por orientação do usuário.

## Crítica visual

ROUND 1
Seen in one second: bancada com editor à esquerda e proporções químicas à direita; partículas ainda estáticas.
Idea (one sentence): a contagem exata de átomos vira uma composição que o estudante consegue explorar.
Live thing: comparação entre entrada e resultado.
Layout words by section: shell=frame / editor=form / reaction=composition / conservation=paired-bars / details=table.
Scores: design 7.5 · usability 7.5 · creativity 7 · content 8.5 → overall 7.6.
Caps applied: regras para aplicativos; sem exigência de fotografia ou movimento de entrada.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. A composição fica abaixo da primeira dobra móvel (`before-motion/mobile-fold.jpg`); incluir acesso direto aos átomos.
2. A entrada depende de conhecer fórmulas; oferecer nomes comuns e seleção por teclado ou toque.
3. As partículas não respondem ao estudante; acrescentar movimento pausável e destaque por elemento.

ROUND 2
Seen in one second: bancada científica com partículas coloridas e controles de comparação.
Idea (one sentence): reconhecer, escolher e comparar os mesmos elementos dos dois lados da reação.
Live thing: autocomplete, movimento pausável e destaque por elemento.
Layout words by section: shell=frame / editor=assisted-form / reaction=animated-composition / conservation=interactive-bars / details=table.
Scores: design 7.7 · usability 8.3 · creativity 7.8 · content 8.5 → overall 8.1.
Caps applied: regras para aplicativos; movimento adicional autorizado pelo usuário.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Os átomos continuam abaixo da primeira dobra móvel (`animated-lab/mobile-fold.jpg`); o atalho oferece acesso direto, sem esconder o editor.
2. A tabela de conservação ainda exige rolagem interna em telas estreitas (`animated-lab/mobile-page-01.jpg`); a comparação visual acima entrega a resposta principal.
3. O espaço abaixo do editor é amplo no desktop (`animated-lab/desktop-fold.jpg`); o alinhamento superior mantém os controles juntos e evita esticar o formulário vazio.

Capturas de todas as larguras e páginas foram abertas. As limitações acima permanecem registradas; não são apresentadas como falhas resolvidas.
