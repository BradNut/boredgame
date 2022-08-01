import { writable } from 'svelte/store';
import type { GameType } from '$lib/types';

// Custom store
const state = () => {
  const { subscribe, set, update } = writable<GameType[]>([]);

  function addAll(games: GameType[]) {
    for (const game of games) {
      add(game);
    }
  }

  function add(game: GameType) {
    update((store) => [...store, game]);
  }

  function remove(id: string) {
    update((store) => {
      const newStore = store.filter((item: GameType) => item.id !== id);
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

export const collectionStore = state();
