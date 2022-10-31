import { writable } from 'svelte/store';
import type { SavedGameType } from '$lib/types';

// Custom store
const state = () => {
  const { subscribe, set, update } = writable<SavedGameType[]>([]);

  function addAll(games: SavedGameType[]) {
    for (const game of games) {
      add(game);
    }
  }

  function add(game: SavedGameType) {
    update((store) => [...store, game]);
  }

  function remove(id: string) {
    update((store) => {
      const newStore = store.filter((item: SavedGameType) => item.id !== id);
      return [...newStore];
    });
  }

  function removeAll() {
    update(() => {
      return [];
    });
  }

  return { subscribe, set, update, add, addAll, remove, removeAll };
};

export const wishlistStore = state();
