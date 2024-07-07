<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { theme } from '$state/theme';
	import toast, { Toaster } from 'svelte-french-toast';

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

	$effect(() => {
		if ($flash) {
			if ($flash.type === 'success') {
				toast.success($flash.message);
			} else {
				toast.error($flash.message, {
					duration: 5000
				});
			}

			// Clearing the flash message could sometimes
			// be required here to avoid double-toasting.
			flash.set(undefined);
		}
	});
</script>

<h1>Do the admin stuff</h1>

<slot />

<Toaster />

<style lang="postcss">
	:global(main) {
		margin: 0;
		max-width: 100vw;
	}
</style>