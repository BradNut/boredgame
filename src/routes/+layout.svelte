<script lang="ts">
	import { browser } from '$app/environment';
	import { navigating } from '$app/stores';
	import debounce from 'just-debounce-it';
	import { Toy } from '@leveluptuts/svelte-toy';
	import 'iconify-icon';
	import Analytics from '$lib/components/analytics.svelte';
	import Header from '$lib/components/header/index.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Loading from '$lib/components/loading.svelte';
	import Transition from '$lib/components/transition/index.svelte';
	import Portal from '$lib/Portal.svelte';
	import { boredState } from '$lib/stores/boredState';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import { toast } from '$lib/components/toast/toast';
	import Toast from '$lib/components/toast/Toast.svelte';
	import '$styles/styles.pcss';
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
</script>

{#if !dev}
	<Analytics />
{/if}

{#if dev}
	<Toy
		register={{
			boredState,
			collectionStore,
			wishlistStore,
			gameStore,
			toast
		}}
	/>
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
{#if $boredState?.loading}
	<Portal>
			<div class="loading">
				<Loading />
				<h3>Loading...</h3>
			</div>
		<div class="background" />
	</Portal>
{/if}
{#if isOpen}
	<div class="container">
		<svelte:component this={$boredState?.dialog?.content} />
	</div>
{/if}
<Toast />

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
