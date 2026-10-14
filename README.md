# 🧪 QuimLab — Simulador Interativo de Reações Químicas

Uma plataforma educacional interativa de química desenvolvida para que estudantes e professores possam **montar, visualizar, balancear e compreender equações químicas** com rigor científico e facilidade didática.

---

## 🌟 Principais Recursos

- **Balanceador Matemático Exato (Zero IA no cálculo):**
  - Implementado em TypeScript puro utilizando **Eliminação Gaussiana com Frações Racionais Exatas (`BigInt`)**.
  - Evita erros de arredondamento de ponto flutuante e garante coeficientes estequiométricos inteiros mínimos verdadeiros.
- **Parser Robusto de Fórmulas Químicas:**
  - Suporta parênteses e subgrupos aninhados (ex: `Al2(SO4)3`, `Ca(OH)2`).
  - Reconhece estados físicos (`(s)`, `(l)`, `(g)`, `(aq)`).
  - Reconhece hidratos com ponto ou asterisco (ex: `CuSO4·5H2O`).
  - Calcula a massa molar exata consultando as massas atômicas padrão IUPAC da tabela periódica.
- **Tabela de Conservação de Átomos e Massa (Lei de Lavoisier):**
  - Compara visualmente os átomos de cada elemento nos reagentes e produtos.
  - Exibe a massa molar total dos reagentes vs produtos em g/mol, comprovando a conservação da massa.
- **Classificador Didático de Reações:**
  - Identifica automaticamente múltiplas categorias:
    - *Síntese / Combinação / Adição*
    - *Decomposição / Pirólise*
    - *Simples Troca / Deslocamento* (com suporte à série de reatividade dos metais)
    - *Dupla Troca* (com verificação de precipitação e regras de solubilidade)
    - *Combustão*
    - *Neutralização Ácido-Base*
    - *Oxirredução (Redox)*
- **Montador Visual de Reações (Workbench):**
  - Permite montar reagentes e produtos clicando nas substâncias do catálogo ou digitando fórmulas.
  - Ajuste rápido de coeficientes com botões `+` e `-`.
- **Modo Desafio / Jogo Estequiométrico:**
  - O usuário testa suas habilidades ajustando coeficientes manualmente com feedback pedagógico e pontuação por nível (Iniciante, Intermediário, Avançado).
- **Catálogo Integrado de Substâncias Químicas:**
  - Nomenclatura oficial (IUPAC), nomes usuais/populares, massas molares e descrições didáticas.
  - Filtros por função química: Ácidos, Bases, Sais, Óxidos, Substâncias Simples e Orgânicos.
- **Persistência de Dados e Histórico:**
  - Histórico de reações e favoritos armazenados em `localStorage` (offline-first).
  - Suporte completo a **Supabase** (PostgreSQL com Row Level Security) para sincronização em nuvem e autenticação.
- **Interface Moderna e Responsiva:**
  - Suporte completo a tema Claro (Light) e Escuro (Dark).
  - Tipografia científica legível e design limpo com ícones Lucide.

---

## 🏛️ Arquitetura em 3 Camadas

O QuimLab foi projetado seguindo uma separação estrita de responsabilidades:

```text
src/
├── chemistry/             # CAMADA 1: MOTOR QUÍMICO INDEPENDENTE (Pure TS, Zero UI)
│   ├── periodicTable.ts   # Tabela periódica com massas atômicas IUPAC
│   ├── formulaParser.ts   # Parser de fórmulas químicas e cálculo de massa molar
│   ├── equationParser.ts  # Parser de equações, reagentes, produtos e setas
│   ├── balancer.ts        # Frações BigInt, matriz RREF e resolução linear exata
│   ├── atomCounter.ts     # Contagem de átomos e verificação de conservação
│   ├── substanceCatalog.ts# Catálogo de substâncias, nomes usuais e descrições
│   ├── reactionClassifier.ts # Classificador com regras didáticas
│   ├── solubility.ts      # Regras de solubilidade aquosa e série de reatividade
│   ├── presetReactions.ts # Reações didáticas pré-cadastradas
│   └── __tests__/         # 28 testes unitários automatizados com Vitest
├── components/            # CAMADA 2: INTERFACE VISUAL (React 19 + TypeScript + CSS)
│   ├── Navbar.tsx
│   ├── VisualEquationBuilder.tsx
│   ├── AtomCounterTable.tsx
│   ├── FormulaDisplay.tsx
│   ├── ReactionBadges.tsx
│   └── SubstanceDetailCard.tsx
├── pages/                 # PÁGINAS DO APLICATIVO
│   ├── SimulatorPage.tsx  # Laboratório virtual, presets, modo manual, histórico
│   ├── SubstanceCatalogPage.tsx # Catálogo com busca e filtros por função
│   ├── ReactionGuidePage.tsx    # Guia educativo dos tipos de reações
│   └── ChallengesPage.tsx       # Exercícios interativos de balanceamento
└── services/              # CAMADA 3: PERSISTÊNCIA & SERVIÇOS
    ├── supabase.ts        # Cliente Supabase com fallback gracioso
    ├── historyService.ts  # Histórico local com sync opcional no Supabase
    └── favoritesService.ts# Favoritos locais com sync opcional no Supabase
```

> [!NOTE]
> Toda a pasta `src/chemistry/` é **100% agnóstica de UI**, pronta para ser reutilizada diretamente em um aplicativo mobile com **React Native** ou em uma API de backend no **Railway / Node.js**.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** v18+ (testado no Node v24)
- **npm** ou **pnpm** / **yarn**

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar os testes automatizados
```bash
npm test
```
*Os testes da suíte de química e solubilidade devem passar com sucesso.*

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Abra o navegador em `http://localhost:5173`.

### 4. Build de produção
```bash
npm run build
```

---

## 🗄️ Configuração do Banco de Dados Supabase (Opcional)

Por padrão, o QuimLab funciona **100% offline no navegador** utilizando `localStorage`. Para ativar o salvamento multi-dispositivo na nuvem:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No painel SQL do Supabase, execute o script de migração:
  - [`supabase/migrations/20250101_init_quimlab.sql`](supabase/migrations/20250101_init_quimlab.sql)
3. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```
4. Reinicie o servidor com `npm run dev`. O aplicativo sincronizará automaticamente o histórico e favoritos com o Supabase quando houver usuário autenticado!
