<script lang="ts">
	// import "../app.postcss";
	import { onMount } from "svelte";
	import { getFlash } from 'sveltekit-flash-message/client';
	import toast, { Toaster } from 'svelte-french-toast';
  import { navigating, page } from '$app/stores';
	import { browser } from '$app/environment';
	import debounce from 'just-debounce-it';
	import 'iconify-icon';
	import Transition from '$lib/components/transition/index.svelte';
	import Analytics from '$lib/components/analytics.svelte';
	import Header from '$lib/components/header/index.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Loading from '$lib/components/loading.svelte';
	import Portal from '$lib/Portal.svelte';
	import { boredState } from '$lib/stores/boredState';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import { theme } from '$state/theme';
	import type { SavedGameType } from '$lib/types';

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

	if (browser) {
	const collator = new Intl.Collator('en');

	let collectionEmpty = $collectionStore.length === 0 || false;
	let wishlistEmpty = $wishlistStore.length === 0 || false;
	if (wishlistEmpty && localStorage?.wishlist && localStorage?.wishlist?.length !== 0) {
		const wishlist: SavedGameType[] = JSON.parse(localStorage.wishlist);
		if (wishlist?.length !== 0) {
			wishlist.sort((a, b) => collator.compare(a.name, b.name));
			for (const item of wishlist) {
				if (!item?.searchTerms) {
					item.searchTerms = `${item?.name?.toLowerCase()}`;
				}
				if (!item?.includeInRandom) {
					item.includeInRandom = false;
				}
			}
			wishlistStore.addAll(wishlist);
		}
	}
	if (collectionEmpty && localStorage?.collection && localStorage?.collection?.length !== 0) {
		const collection: SavedGameType[] = JSON.parse(localStorage.collection);
		if (collection?.length !== 0) {
			collection.sort((a, b) => collator.compare(a.name, b.name));
			for (const item of collection) {
				if (!item?.searchTerms) {
					item.searchTerms = `${item?.name?.toLowerCase()}`;
				}
			}
			collectionStore.addAll(collection);
		}
	}
}

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

	// if ($flash && flashType && flashMessage) {
	// 	switch (flashType) {
	// 		case 'success':
	// 			toast.success(flashMessage);
	// 			break;
	// 		case 'error':
	// 			toast.error(flashMessage);
	// 			break;
	// 		default:
	// 			toast.error(flashMessage);
	// 	}
	// }

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

<div class="wrapper">
	<Header user={data.user} />

	<main>
		<Transition url={data.url} transition={{ type: 'page' }}>
			<slot />
		</Transition>
	</main>

	<Footer />
</div>

<Toaster />

{#if $boredState?.loading}
	<Portal>
			<div class="loading">
				<Loading></Loading>
				<h3>Loading...</h3>
			</div>
		<div class="background"></div>
	</Portal>
{/if}
{#if isOpen}
	<div class="container">
		<svelte:component this={$boredState?.dialog?.content}></svelte:component>
	</div>
{/if}

<style lang="postcss">
	.flash {
		display: inline-block;
		position: absolute;
		place-items: center;
		padding: 0.5rem;
		border-radius: 2px;
	}

	.loading {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
		display: grid;
		place-items: center;
		gap: 1rem;

		& h3 {
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

	.wrapper {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 850px;
		margin: 0 auto;
		padding: 2rem 0rem;
		max-width: 80vw;

		@media (min-width: 1600px) {
			max-width: 70vw;
		}

		box-sizing: border-box;
	}

	:global(.dialog-overlay) {
		position: fixed;
		inset: 0;
		z-index: 100;
		background-color: rgb(0 0 0);
		opacity: 0.8;
	}
</style>
