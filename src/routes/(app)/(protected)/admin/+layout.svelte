<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { theme } from '$state/theme';
	import { toastMessage } from '$lib/utils/superforms.js';

	const { data } = $props();
	const { user } = data;

	const flash = getFlash(page, {
		clearOnNavigate: true,
		clearAfterMs: 3000,
		clearArray: true
	});

	$effect(() => {
		// set the theme to the user's active theme
		$theme = user?.theme || 'system';
		document.querySelector('html')?.setAttribute('data-theme', $theme);
	});
</script>

<h1>Do the admin stuff</h1>

{@render children()}

<!-- <Toaster /> -->

<style lang="postcss">
	:global(main) {
		margin: 0;
		max-width: 100vw;
	}
</style>