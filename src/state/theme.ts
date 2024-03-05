import { writable } from 'svelte/store';

export const theme = writable('system');

const new_theme_selector = () => {
	const { subscribe, update, set } = writable({
		status: 'CLOSED'
	});

	function open() {
		update((theme) => {
			return { ...theme, status: 'OPEN' };
		});
	}

	function close() {
		update((theme) => {
			return { ...theme, status: 'CLOSED' };
		});
	}

	function toggle() {
		update((theme) => {
			return { ...theme, status: status === 'CLOSED' ? 'OPEN' : 'CLOSED' };
		});
	}

	return {
		subscribe,
		update,
		set,
		close,
		open,
		toggle
	};
};

export const theme_selector = new_theme_selector();
