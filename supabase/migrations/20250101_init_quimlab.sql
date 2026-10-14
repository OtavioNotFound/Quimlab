-- ====================================================================
-- QUIMLAB — Esquema Inicial do Banco de Dados Supabase (PostgreSQL)
-- ====================================================================

-- 1. Tabela de Substâncias Químicas
CREATE TABLE IF NOT EXISTS public.substances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    formula TEXT NOT NULL UNIQUE,
    preferred_name TEXT NOT NULL,
    common_names TEXT[] DEFAULT '{}',
    description TEXT,
    molar_mass NUMERIC(8, 4),
    composition JSONB DEFAULT '{}',
    substance_type TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_substances_formula ON public.substances(formula);
CREATE INDEX IF NOT EXISTS idx_substances_preferred_name ON public.substances(preferred_name);

-- 2. Tabela de Reações Químicas Cadastradas
CREATE TABLE IF NOT EXISTS public.reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    equation TEXT NOT NULL,
    reaction_types TEXT[] DEFAULT '{}',
    explanation TEXT,
    conditions TEXT,
    validation_status TEXT DEFAULT 'verified' CHECK (validation_status IN ('verified', 'unverified', 'hypothetical')),
    source_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_reactions_equation ON public.reactions(equation);

-- 3. Tabela de Associação: Substâncias participantes de uma reação
CREATE TABLE IF NOT EXISTS public.reaction_substances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reaction_id UUID NOT NULL REFERENCES public.reactions(id) ON DELETE CASCADE,
    substance_id UUID NOT NULL REFERENCES public.substances(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('reactant', 'product')),
    coefficient INTEGER NOT NULL DEFAULT 1 CHECK (coefficient > 0),
    position INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_reaction_substances_rel ON public.reaction_substances(reaction_id, substance_id);

-- 4. Tabela de Favoritos do Usuário
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    equation TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);

-- 5. Tabela de Histórico de Simulações do Usuário
CREATE TABLE IF NOT EXISTS public.user_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    input_equation TEXT NOT NULL,
    balanced_equation TEXT,
    result_status TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_user_history_user_id ON public.user_history(user_id);

-- ====================================================================
-- POLÍTICAS DE SEGURANÇA POR LINHA (ROW LEVEL SECURITY - RLS)
-- ====================================================================

ALTER TABLE public.substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reaction_substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;

-- Catálogo de substâncias e reações são leitura pública
CREATE POLICY "Permitir leitura pública de substâncias"
    ON public.substances FOR SELECT
    USING (true);

CREATE POLICY "Permitir leitura pública de reações"
    ON public.reactions FOR SELECT
    USING (true);

CREATE POLICY "Permitir leitura pública de participantes de reação"
    ON public.reaction_substances FOR SELECT
    USING (true);

-- Favoritos: o usuário só pode ver, inserir e deletar seus próprios registros
CREATE POLICY "Usuário gerencia seus próprios favoritos"
    ON public.user_favorites
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Histórico: o usuário só pode ver e inserir em seu próprio histórico
CREATE POLICY "Usuário gerencia seu próprio histórico"
    ON public.user_history
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- SEED INICIAL (Substâncias e Reações Fundamentais)
-- ====================================================================

INSERT INTO public.substances (formula, preferred_name, common_names, description, molar_mass, substance_type, composition)
VALUES
    ('H2O', 'Água', ARRAY['Monóxido de di-hidrogênio'], 'Composto vital indispensável para todos os seres vivos, solvente universal.', 18.015, 'Composto molecular (óxido)', '{"H": 2, "O": 1}'),
    ('CO2', 'Dióxido de carbono', ARRAY['Gás carbônico', 'Anidrido carbônico'], 'Gás incolor resultante da respiração e combustão completa de compostos carbônicos.', 44.01, 'Óxido ácido', '{"C": 1, "O": 2}'),
    ('O2', 'Oxigênio molecular', ARRAY['Gás oxigênio'], 'Gás comburente indispensável para a respiração aeróbica.', 31.998, 'Substância simples', '{"O": 2}'),
    ('H2', 'Hidrogênio molecular', ARRAY['Gás hidrogênio'], 'Elemento mais leve e abundante do universo.', 2.016, 'Substância simples', '{"H": 2}'),
    ('NaCl', 'Cloreto de sódio', ARRAY['Sal de cozinha'], 'Sal iônico indispensável para a regulação osmótica.', 58.44, 'Sal inorgânico', '{"Na": 1, "Cl": 1}'),
    ('HCl', 'Ácido clorídrico', ARRAY['Ácido muriático'], 'Ácido inorgânico forte e corrosivo presente no suco gástrico.', 36.46, 'Hidrácido', '{"H": 1, "Cl": 1}'),
    ('NaOH', 'Hidróxido de sódio', ARRAY['Soda cáustica'], 'Base forte inorgânica usada na fabricação de sabões e celulose.', 39.997, 'Base inorgânica', '{"Na": 1, "O": 1, "H": 1}'),
    ('CaCO3', 'Carbonato de cálcio', ARRAY['Calcário', 'Mármore', 'Calcita'], 'Mineral abundante na crosta terrestre e conchas de moluscos.', 100.09, 'Sal inorgânico', '{"Ca": 1, "C": 1, "O": 3}')
ON CONFLICT (formula) DO NOTHING;
