<script lang="ts">
// import { tick, onDestroy } from 'svelte';
import Game from '$components/Game.svelte'
import type { UICollection } from '$lib/types'

const { data } = $props()
const { items = [] } = data
console.log(`Page data: ${JSON.stringify(data)}`)
let collection: UICollection = data?.collection ?? {}
console.log('items', items)

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
	<title>{collection.name ?? 'Your Collection'} | Bored Game</title>
</svelte:head>

<h1>{collection.name ?? 'Your Collection'}</h1>
<!-- <input type="text" id="search" name="search" placeholder="Search Your Collection" bind:value={$searchStore.search} /> -->

<div class="games">
	<div class="games-list">
		{#if items.length === 0}
			<h2>No gamesTable in your collection</h2>
		{:else}
			{#each items as game (game.game_id)}
				<Game {game} />
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
