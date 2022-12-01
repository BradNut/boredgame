import { readable } from 'svelte/store';

export function mediaQueryStore(query: string) {
	if (typeof window === 'undefined') {
		// check if it's rendered in the dom so window is not undefined
		return readable('');
	}
	const mediaQueryList = window.matchMedia(query);

	const mediaStore = readable(mediaQueryList.matches, (set) => {
		const handleChange = () => set(mediaQueryList.matches);

		try {
			mediaQueryList.addEventListener('change', handleChange);
		} catch (_) {
			mediaQueryList.addListener(handleChange);
		}

		return () => {
			try {
				mediaQueryList.removeEventListener('change', handleChange);
			} catch (_) {
				mediaQueryList.removeListener(handleChange);
			}
		};
	});

	return mediaStore;
}

export const xs = mediaQueryStore('(min-width: 480px');

export const sm = mediaQueryStore('(min-width: 640px');

export const md = mediaQueryStore('(min-width: 768px)');

export const lg = mediaQueryStore('(min-width: 1024px)');

export const xl = mediaQueryStore('(min-width: 1280px)');

export const xxl = mediaQueryStore('(min-width: 1536px)');
