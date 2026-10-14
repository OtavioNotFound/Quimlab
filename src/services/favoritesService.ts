import { supabase, isSupabaseConfigured } from './supabase';

export interface FavoriteItem {
  id: string;
  equation: string;
  name?: string;
  timestamp: number;
}

const STORAGE_KEY = 'quimlab-favorites-v1';

export async function addFavorite(equation: string, name?: string): Promise<FavoriteItem> {
  const item: FavoriteItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    equation,
    name,
    timestamp: Date.now()
  };

  try {
    const favorites = getLocalFavorites();
    if (!favorites.some(f => f.equation === equation)) {
      const updated = [item, ...favorites];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Erro ao salvar favorito local:', err);
  }

  // Sincronização com Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('user_favorites').insert({
          user_id: session.user.id,
          equation,
          name
        });
      }
    } catch (err) {
      console.warn('Erro ao sincronizar favorito com Supabase:', err);
    }
  }

  return item;
}

export async function removeFavorite(equation: string): Promise<void> {
  try {
    const favorites = getLocalFavorites();
    const updated = favorites.filter(f => f.equation !== equation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Erro ao remover favorito local:', err);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('user_favorites')
          .delete()
          .match({ user_id: session.user.id, equation });
      }
    } catch (err) {
      console.warn('Erro ao remover favorito no Supabase:', err);
    }
  }
}

export function isFavorite(equation: string): boolean {
  const favorites = getLocalFavorites();
  return favorites.some(f => f.equation === equation);
}

export function getLocalFavorites(): FavoriteItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
