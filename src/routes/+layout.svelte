<script lang="ts">
	import { browser } from '$app/environment';
	import { navigating } from '$app/stores';
	import debounce from 'just-debounce-it';
	import { Toy } from '@leveluptuts/svelte-toy';
	import Analytics from '$lib/components/analytics.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import Loading from '$lib/components/loading.svelte';
	import Transition from '$lib/components/transition/index.svelte';
	import Portal from '$lib/Portal.svelte';
	import { boredState } from '$lib/stores/boredState';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$root/lib/stores/wishlistStore';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import { toast } from '$lib/components/toast/toast';
	import Toast from '$lib/components/toast/Toast.svelte';
	import '$root/styles/styles.pcss';

	import type { SavedGameType } from '$root/lib/types';


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
		let collectionEmpty = $collectionStore.length === 0 || false;
		let wishlistEmpty = $wishlistStore.length === 0 || false;
		if (wishlistEmpty && localStorage?.wishlist && localStorage?.wishlist?.length !== 0) {
			const wishlist: SavedGameType[] = JSON.parse(localStorage.wishlist);
			if (wishlist?.length !== 0) {
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

<Transition transition={{ type: 'fade', duration: 250 }}>
	<div class="wrapper">
		<Header />
		<Transition transition={{ type: 'page' }}>
			<main>
				<slot />
			</main>
		</Transition>
		<footer>
			<p>Built by <a target="__blank" href="https://bradleyshellnut.com">Bradley Shellnut</a></p>
			<p>
				<a
					target="__blank"
					href="https://www.flaticon.com/free-icons/board-game"
					title="board game icons">Board game icons created by Freepik - Flaticon</a
				>
			</p>
		</footer>
	</div>
	{#if $boredState?.loading}
		<Portal>
			<Transition transition={{ type: 'fade', duration: 0 }}>
				<div class="loading">
					<Loading />
					<h3>Loading...</h3>
				</div>
			</Transition>
			<div class="background" />
		</Portal>
	{/if}
	{#if isOpen}
		<div class="container">
			<svelte:component this={$boredState?.dialog?.content} />
		</div>
	{/if}
	<Toast />
</Transition>

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
			max-width: 65vw;
		}

		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}

	:global(.dialog-overlay) {
		position: fixed;
		inset: 0;
		z-index: 100;
		background-color: rgb(0 0 0);
		opacity: 0.8;
	}
</style>
