<script lang="ts">
	import "$lib/styles/app.pcss";
	import { onMount } from "svelte";
	import { getFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
	import { MetaTags } from 'svelte-meta-tags';
	import 'iconify-icon';
  import { page } from '$app/stores';
	import { onNavigate } from "$app/navigation";
	import Analytics from '$components/Analytics.svelte';
	import { theme } from '$state/theme';
	import PageLoadingIndicator from '$lib/page_loading_indicator.svelte';

	const dev = process.env.NODE_ENV !== 'production';

	const { data, children } = $props();
	const { user } = data;

	const metaTags = $derived({
		titleTemplate: '%s | Bored Game',
		description: 'Bored Game, keep track of your games.',
		openGraph: {
			type: 'website',
			titleTemplate: '%s | Bored Game',
			locale: 'en_US',
			description: 'Bored Game, keep track of your games',
		},
		...$page.data.metaTagsChild
	});

	const flash = getFlash(page, {
    clearOnNavigate: true,
    clearAfterMs: 3000,
    clearArray: true
  });

	onMount(() => {
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

	onNavigate(async (navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((oldStateCaptureResolve) => {
			document.startViewTransition(async () => {
				oldStateCaptureResolve();
				await navigation.complete;
			})
		})
	});
</script>

{#if !dev}
	<Analytics />
{/if}

<MetaTags {...metaTags} />

<PageLoadingIndicator />

<div class="layout">
	{@render children()}
</div>

<Toaster />
<!-- <Loading /> -->

<style lang="postcss">
	.layout {
		display: flex;
		position: relative;
		flex-direction: column;
		min-height: 100vh;
	}
</style>