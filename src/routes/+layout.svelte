<script lang="ts">
	import "$lib/styles/app.pcss";
	import { onMount } from "svelte";
	import { getFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
  import { navigating, page } from '$app/stores';
	import { MetaTags } from 'svelte-meta-tags';
	import debounce from 'just-debounce-it';
	import 'iconify-icon';
	import Analytics from '$lib/components/analytics.svelte';
	import Portal from "$lib/Portal.svelte";
	import Loading from "$components/loading.svelte";
	import { boredState } from '$lib/stores/boredState';
	import { theme } from '$state/theme';

	const dev = process.env.NODE_ENV !== 'production';

	export let data;
	$: ({ user } = data);

	$: metaTags = {
		titleTemplate: '%s | Bored Game',
		description: 'Bored Game, keep track of your games.',
		openGraph: {
			type: 'website',
			titleTemplate: '%s | Bored Game',
			locale: 'en_US',
			description: 'Bored Game, keep track of your games',
		},
		...$page.data.metaTagsChild
	}

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
	$: loading = $boredState?.loading;

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

<MetaTags {...metaTags} />

<div class="layout">
	<slot />
</div>

{#if loading}
	<Portal>
		<div class="loading">
			<Loading />
			<h3>Loading...</h3>
		</div>
	<div class="background" />
	</Portal>
{/if}

<Toaster />

<style lang="postcss">
	.loading {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
		display: grid;
		place-items: center;
		gap: 1rem;

		h3 {
			color: white;
		}
	}

	.background {
		background: black;
		opacity: 0.8;
		cursor: none;
		inset: 0;
		position: fixed;
		z-index: 100;
	}

	.layout {
		display: flex;
		position: relative;
		flex-direction: column;
		min-height: 100vh;
	}
</style>