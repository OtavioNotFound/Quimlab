import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getLocalHistory } from './historyService';
import { getLocalFavorites } from './favoritesService';

const storedValues = new Map<string, string>();

beforeEach(() => {
  storedValues.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storedValues.get(key) ?? null,
    setItem: (key: string, value: string) => storedValues.set(key, value),
    removeItem: (key: string) => storedValues.delete(key)
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('local storage services', () => {
  it('ignora histórico com formato JSON inesperado', () => {
    storedValues.set('quimlab-history-v1', JSON.stringify({ invalid: true }));
    expect(getLocalHistory()).toEqual([]);

    storedValues.set('quimlab-history-v1', JSON.stringify([{ invalid: true }]));
    expect(getLocalHistory()).toEqual([]);
  });

  it('ignora favoritos com formato JSON inesperado', () => {
    storedValues.set('quimlab-favorites-v1', JSON.stringify({ invalid: true }));
    expect(getLocalFavorites()).toEqual([]);

    storedValues.set('quimlab-favorites-v1', JSON.stringify([{ invalid: true }]));
    expect(getLocalFavorites()).toEqual([]);
  });
});
