<script lang="ts">
	// import { tick, onDestroy } from 'svelte';
	import Game from '$lib/components/game/index.svelte';
	import type { SearchSchema } from '$lib/zodValidation.js';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ModifyListGame } from '$lib/config/zod-schemas.js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	// import { collectionStore } from '$lib/stores/collectionStore';
	// import type { GameType, SavedGameType } from '$lib/types';
	// import { boredState } from '$lib/stores/boredState';
	// import Pagination from '$lib/components/pagination/index.svelte';
	// import RemoveCollectionDialog from '$lib/components/dialog/RemoveCollectionDialog.svelte';
	// import RemoveWishlistDialog from '$lib/components/dialog/RemoveWishlistDialog.svelte';
	// import { createSearchStore, searchHandler } from '$lib/stores/search';

	export let data;
	console.log(`Page data: ${JSON.stringify(data)}`);
	let collectionItems = data?.collection || [];
	console.log('collectionItems', collectionItems);

	// let gameToRemove: GameType | SavedGameType;
	// let pageSize = 10;
	// let page = 1;

	// const searchStore = createSearchStore($collectionStore);
	// console.log('searchStore', $searchStore);

	// const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	// onDestroy(() => {
	// 	unsubscribe();
	// });

	// $: skip = (page - 1) * pageSize;
	// $: gamesShown = $searchStore.data.slice(skip, skip + pageSize);
	// $: totalItems = $searchStore.search === '' ? $collectionStore.length : $searchStore.filtered.length;

	// interface RemoveGameEvent extends Event {
	// 	detail: GameType | SavedGameType;
	// }

	// function handleRemoveCollection(event: RemoveGameEvent) {
	// 	console.log('Remove collection event handler');
	// 	console.log('event', event);
	// 	gameToRemove = event?.detail;
	// 	boredState.update((n) => ({
	// 		...n,
	// 		dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: gameToRemove }
	// 	}));
	// }

	// function handleRemoveWishlist(event: RemoveGameEvent) {
	// 	console.log('Remove wishlist event handler');
	// 	console.log('event', event);
	// 	gameToRemove = event?.detail;
	// 	boredState.update((n) => ({
	// 		...n,
	// 		dialog: { isOpen: true, content: RemoveWishlistDialog, additionalData: gameToRemove }
	// 	}));
	// }

	// async function handleNextPageEvent(event: CustomEvent) {
	// 	if (+event?.detail?.page === page + 1) {
	// 		page += 1;
	// 	}
	// 	await tick();
	// }

	// async function handlePreviousPageEvent(event: CustomEvent) {
	// 	if (+event?.detail?.page === page - 1) {
	// 		page -= 1;
	// 	}
	// 	await tick();
	// }

	// async function handlePerPageEvent(event: CustomEvent) {
	// 	page = 1;
	// 	pageSize = event.detail.pageSize;
	// 	await tick();
	// }
</script>

<svelte:head>
	<title>Your Collection | Bored Game</title>
</svelte:head>

<h1>Your Collection</h1>
<!-- <input type="text" id="search" name="search" placeholder="Search Your Collection" bind:value={$searchStore.search} /> -->

<div class="games">
	<div class="games-list">
		{#if collectionItems.length === 0}
			<h2>No games in your collection</h2>
		{:else}
			{#each collectionItems as game (game.game_id)}
				<Game {game} data={data.listManageForm} />
			{/each}
		{/if}
	</div>
	<!-- {#if $collectionStore.length !== 0}
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
	{/if} -->
</div>

<style lang="postcss">
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
