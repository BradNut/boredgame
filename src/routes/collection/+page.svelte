<script lang="ts">
	import Game from '$lib/components/game/index.svelte';
	import { collectionStore } from '$lib/stores/collectionStore';
	import type { GameType, SavedGameType } from '$root/lib/types';
	import { boredState } from '$root/lib/stores/boredState';
	import Pagination from '$root/lib/components/pagination/index.svelte';
	import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
	import RemoveWishlistDialog from '$root/lib/components/dialog/RemoveWishlistDialog.svelte';
	import { tick } from 'svelte';

	let gameToRemove: GameType | SavedGameType;
	let pageSize = 10;
	let page = 1;

	$: totalItems = $collectionStore.length;
	$: skip = (page - 1) * pageSize;
	$: gamesShown = $collectionStore.slice(skip, skip + pageSize);

	interface RemoveGameEvent extends Event {
		detail: GameType | SavedGameType;
	}

	function handleRemoveCollection(event: RemoveGameEvent) {
		console.log('Remove collection event handler');
		console.log('event', event);
		gameToRemove = event?.detail;
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: gameToRemove }
		}));
	}

	function handleRemoveWishlist(event: RemoveGameEvent) {
		console.log('Remove wishlist event handler');
		console.log('event', event);
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
	<title>Your Collection | Bored Game</title>
</svelte:head>

<h1>Your Collection</h1>

<div class="games">
	<div class="games-list">
		{#if $collectionStore.length === 0}
			<h2>No games in your collection</h2>
		{:else}
			{#each gamesShown as game (game.id)}
				<Game
					on:handleRemoveWishlist={handleRemoveWishlist}
					on:handleRemoveCollection={handleRemoveCollection}
					{game}
				/>
			{/each}
		{/if}
	</div>
	{#if $collectionStore.length !== 0}
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
