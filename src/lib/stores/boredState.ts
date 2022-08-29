import type { BoredStore } from '$lib/types';
import { writable } from 'svelte/store';
// import { BoredStore } from '$lib/types';

// Custom store
const state = () => {
  const { subscribe, set, update } = writable<BoredStore>({ loading: false, dialogOpen: false });

  // function remove(id: string) {
  // 	update((store) => {
  // 		const newStore = store.filter((item: GameType) => item.id !== id);
  // 		return [...newStore];
  // 	});
  // }

  // function removeAll() {
  // 	update(() => {
  // 		return [];
  // 	});
  // }

  function clear() {
    set({ loading: false, dialogOpen: false });
  }

  return { subscribe, set, update, clear };
};

export const boredState = state();
