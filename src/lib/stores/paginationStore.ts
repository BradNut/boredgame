import { writable } from 'svelte/store';

// Custom store
const state = () => {
	const initial = 1;
	const { subscribe, set, update } = writable(initial);

	function clear() {
		set(initial);
	}

	return { subscribe, set, update, clear };
};

export const pagination = state();
