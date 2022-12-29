import { writable } from 'svelte/store';
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
	const searchTerm = store.search.toLowerCase() || '';
	store.filtered = store.data.filter((item) => {
		return item.searchTerms.toLowerCase().includes(searchTerm);
	});
};
