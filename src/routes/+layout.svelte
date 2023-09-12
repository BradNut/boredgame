<script lang="ts">
	import "$lib/styles/app.postcss";
	import { onMount } from "svelte";
	import { getFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
  import { navigating, page } from '$app/stores';
	import debounce from 'just-debounce-it';
	import 'iconify-icon';
	import Analytics from '$lib/components/analytics.svelte';
	import { boredState } from '$lib/stores/boredState';
	import { theme } from '$state/theme';

	const dev = process.env.NODE_ENV !== 'production';

	export let data;
	$: ({ user } = data);

	const flash = getFlash(page, {
		clearAfterMs: 6000
	});
	let flashType;
	let flashMessage;
	$: flashType = $flash?.type;
	$: flashMessage = $flash?.message;

	$: {
		if ($navigating) {
			debounce(() => {
				boredState.update((n) => ({ ...n, loading: true }));
			}, 250);
		}
		if (!$navigating) {
			boredState.update((n) => ({ ...n, loading: false }));
		}
	}

	$: isOpen = $boredState?.dialog?.isOpen;

	onMount(() => {
		// set the theme to the user's active theme
		$theme = user?.theme || 'system';
		document.querySelector('html')?.setAttribute('data-theme', $theme);
	});

	flash.subscribe(($flash) => {
		if (!$flash) return;

		if ($flash.type == 'success') {
			toast.success($flash.message);
		} else {
			toast.error($flash.message, {
				duration: 5000
			});
		}

		// Clearing the flash message could sometimes
		// be required here to avoid double-toasting.
		flash.set(undefined);
	});
</script>

{#if !dev}
	<Analytics />
{/if}

<div class="layout">
	<slot />
</div>

<Toaster />

<style lang="postcss">
	.layout {
		display: flex;
		position: relative;
		flex-direction: column;
		min-height: 100vh;
	}
</style>