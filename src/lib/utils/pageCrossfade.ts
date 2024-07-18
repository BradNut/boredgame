import { crossfade } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: d => Math.sqrt(d * 200),
	easing: quintOut,

	// You can customize the fallBack if the element sizes are significantly different
	fallback(node, params) {
		return { duration: 600, easing: x => --x * x * x + 1 }; // Ease-out cubic
	}
});