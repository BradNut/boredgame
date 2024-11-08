import {crossfade} from 'svelte/transition';

export const [send, receive] = crossfade({
	duration: d => Math.sqrt(d * 200),
	fallback() {
		return { duration: 600, easing: x => --x * x * x + 1 }; // Ease-out cubic
	}
});