import { supabase, isSupabaseConfigured } from './supabase';

export interface HistoryItem {
  id: string;
  inputEquation: string;
  balancedEquation: string;
  isBalanced: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'quimlab-history-v1';
const MAX_HISTORY = 30;

export async function saveToHistory(
  inputEquation: string,
  balancedEquation: string,
  isBalanced: boolean
): Promise<void> {
  const item: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    inputEquation,
    balancedEquation,
    isBalanced,
    timestamp: Date.now()
  };

  try {
    const existing = getLocalHistory();
    // Evita duplicar se for idêntica à última entrada
    if (existing.length > 0 && existing[0].inputEquation === inputEquation && existing[0].balancedEquation === balancedEquation) {
      return;
    }

    const updated = [item, ...existing.filter(i => i.inputEquation !== inputEquation)].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Erro ao salvar no histórico local:', err);
  }

  // Sincronização opcional com Supabase se houver sessão ativa
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('user_history').insert({
          user_id: session.user.id,
          input_equation: inputEquation,
          balanced_equation: balancedEquation,
          result_status: isBalanced ? 'balanced' : 'unbalanced'
        });
      }
    } catch (err) {
      console.warn('Erro ao sincronizar histórico com Supabase:', err);
    }
  }
}

export function getLocalHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed: unknown = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter(isHistoryItem) : [];
  } catch {
    return [];
  }
}

function isHistoryItem(item: unknown): item is HistoryItem {
  if (typeof item !== 'object' || item === null) return false;
  const record = item as Record<string, unknown>;
  return typeof record.id === 'string'
    && typeof record.inputEquation === 'string'
    && typeof record.balancedEquation === 'string'
    && typeof record.isBalanced === 'boolean'
    && typeof record.timestamp === 'number'
    && Number.isFinite(record.timestamp);
}

export function clearLocalHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Erro ao limpar histórico:', err);
  }
}
