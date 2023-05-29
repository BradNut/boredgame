<script lang="ts">
	import { tick, onDestroy } from 'svelte';
	import Game from '$lib/components/game/index.svelte';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import type { GameType, SavedGameType } from '$lib/types';
	import { boredState } from '$lib/stores/boredState';
	import Pagination from '$lib/components/pagination/index.svelte';
	import RemoveWishlistDialog from '$lib/components/dialog/RemoveWishlistDialog.svelte';
	import RemoveCollectionDialog from '$lib/components/dialog/RemoveCollectionDialog.svelte';
  import { createSearchStore, searchHandler } from '$lib/stores/search';

	let gameToRemove: GameType | SavedGameType;
	let pageSize = 10;
	let page = 1;

	const searchStore = createSearchStore($wishlistStore);
	console.log('searchStore', $searchStore);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});

	$: skip = (page - 1) * pageSize;
	$: gamesShown = $searchStore.filtered.slice(skip, skip + pageSize);
	$: totalItems = $searchStore.search === '' ? $wishlistStore.length : $searchStore.filtered.length;

	interface RemoveGameEvent extends Event {
		detail: GameType | SavedGameType;
	}

	function handleRemoveCollection(event: RemoveGameEvent) {
		gameToRemove = event?.detail;
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: gameToRemove }
		}));
	}

	function handleRemoveWishlist(event: RemoveGameEvent) {
		gameToRemove = event?.detail;
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveWishlistDialog, additionalData: gameToRemove }
		}));
	}

	async function handleNextPageEvent(event: CustomEvent) {
		if (+event?.detail?.page === page + 1) {
			page += 1;
		}
		await tick();
	}

	async function handlePreviousPageEvent(event: CustomEvent) {
		if (+event?.detail?.page === page - 1) {
			page -= 1;
		}
		await tick();
	}

	async function handlePerPageEvent(event: CustomEvent) {
		page = 1;
		pageSize = event.detail.pageSize;
		await tick();
	}
</script>

<svelte:head>
	<title>Your Wishlist | Bored Game</title>
</svelte:head>

<h1>Your Wishlist</h1>
<input type="text" id="search" name="search" placeholder="Search Your Wishlist" bind:value={$searchStore.search} />

<div class="games">
	<div class="games-list">
		{#if $wishlistStore.length === 0}
			<h2>No games in your wishlist</h2>
		{:else}
			{#each gamesShown as game}
				<Game
					on:handleRemoveWishlist={handleRemoveWishlist}
					on:handleRemoveCollection={handleRemoveCollection}
					{game}
				/>
			{/each}
		{/if}
	</div>
	{#if $wishlistStore.length !== 0}
		<Pagination
			{pageSize}
			{page}
			{totalItems}
			forwardText="Next"
			backwardText="Prev"
			pageSizes={[10, 25, 50, 100]}
			on:nextPageEvent={handleNextPageEvent}
			on:previousPageEvent={handlePreviousPageEvent}
			on:perPageEvent={handlePerPageEvent}
		/>
	{/if}
</div>

<style lang="scss">
	h1 {
		margin: 1.5rem 0rem;
		width: 100%;
	}

	.games {
		margin: 2rem 0rem;
	}

	.games-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(200px, 1fr));
		gap: 2rem;

		@media (max-width: 800px) {
			grid-template-columns: 1fr 1fr;
		}

		@media (max-width: 550px) {
			grid-template-columns: 1fr;
		}
	}
</style>
