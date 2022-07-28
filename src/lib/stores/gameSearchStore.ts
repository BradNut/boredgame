import { writable } from 'svelte/store';
import type { GameType } from '$lib/types';

// Custom store
const newGameStore = () => {
  const { subscribe, update } = writable<GameType[]>([]);

  function add(game: GameType) {
    update((store) => [...store, game]);
  }

  function addAll(games: GameType[]) {
    update((store) => [...store, ...games]);
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

  return { subscribe, add, addAll, remove, removeAll };
};

export const gameStore = newGameStore();
