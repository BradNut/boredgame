import { writable, type Writable } from 'svelte/store';
import type { SavedGameType } from '../types';

export const createSearchStore = (data: SavedGameType[]) => {
	const { subscribe, set, update } = writable({
		data,
		filtered: data,
		search: ''
	});

	return {
		subscribe,
		set,
		update
	};
};

export const searchHandler = (store) => {
	console.log(`Store value: ${JSON.stringify(store)}`);

	const searchTerm = store.search.toLowerCase() || '';
	store.filtered = store.data.filter((item: SavedGameType) => {
		return item.searchTerms.toLowerCase().includes(searchTerm);
	});
};
