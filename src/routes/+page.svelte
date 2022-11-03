<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { ToastType, type GameType, type SavedGameType } from '$root/lib/types';
	import { toast } from '$root/lib/components/toast/toast';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import { boredState } from '$root/lib/stores/boredState';
	import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
	import Game from '$lib/components/game/index.svelte';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';
	import RandomSearch from '$lib/components/search/random/index.svelte';
	import Random from '$lib/components/random/index.svelte';
	import Pagination from '$lib/components/pagination/index.svelte';
	import RemoveWishlistDialog from '$root/lib/components/dialog/RemoveWishlistDialog.svelte';
	import SkeletonPlaceholder from '$root/lib/components/SkeletonPlaceholder.svelte';

	export let data: PageData;
	export let form: ActionData;
	console.log('form routesss', form);
	console.log('Formed data:', JSON.stringify(data));
	let pageSize: number;
	let currentPage: number;
	$: totalItems = 0;
	console.log('totalItems', totalItems);

	// async function handleItemsPerPageChange(event) {
	//   const perPage = event?.detail;
	//   if ($gameStore.length )
	// }
	async function handleNextPageEvent(event: CustomEvent) {
		console.log('Next page called', event);
		boredState.update((n) => ({ ...n, loading: true }));
		const form = event.target as HTMLFormElement;
		console.log('form', form);
		const response = await fetch('/api/game', {
			method: 'POST',
			headers: { accept: 'application/json' },
			body: new FormData(form)
		});
		const responseData = await response.json();
		boredState.update((n) => ({ ...n, loading: false }));
		gameStore.removeAll();
		gameStore.addAll(responseData?.games);
		const skip = $boredState?.search?.skip;
		const pageSize = $boredState?.search?.pageSize;
		const currentPage = $boredState?.search?.currentPage;
		const totalCount = responseData?.totalCount;
		boredState.update((n) => ({
			...n,
			search: { totalCount, skip, pageSize, currentPage }
		}));
	}

	let isOpen: boolean = false;
	let gameToRemove: GameType | SavedGameType;
	console.log('isOpen', isOpen);

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
</script>

<svelte:head>
	<title>Bored Game | Home</title>
</svelte:head>

<h1>Search Boardgames!</h1>
<p style="margin: 1rem 0;">
	Input your requirements to search for board games that match your criteria.
</p>
<div class="game-search">
	<form
		action="/search"
		method="post"
		use:enhance={() => {
			gameStore.removeAll();
			boredState.update((n) => ({ ...n, loading: true }));
			return async ({ result }) => {
				boredState.update((n) => ({ ...n, loading: false }));
				console.log('result main page search', result);
				// `result` is an `ActionResult` object
				if (result.type === 'success') {
					console.log('In success');
					const resultGames = result?.data?.games;
					if (resultGames?.length <= 0) {
						toast.send('No results found 😿', {
							duration: 3000,
							type: ToastType.ERROR,
							dismissible: true
						});
					}
					gameStore.addAll(resultGames);
					totalItems = result?.data?.totalCount;
					console.log(`Frontend result: ${JSON.stringify(result)}`);
					await applyAction(result);
				} else {
					console.log('Invalid');
					await applyAction(result);
				}
			};
		}}
	>
		<TextSearch showButton advancedSearch {form} />
	</form>
	<section>
		<p>Or pick a random game!</p>
		<div class="random-buttons">
			<RandomSearch />
			<Random />
		</div>
	</section>
</div>

<!-- <SkeletonPlaceholder style="height: 12rem; width: 12rem; border-radius: 10px;" /> -->
{#if $gameStore?.length > 0}
	<div class="games">
		<h1>Games Found:</h1>
		<div class="games-list">
			{#each $gameStore as game (game.id)}
				<Game
					on:handleRemoveWishlist={handleRemoveWishlist}
					on:handleRemoveCollection={handleRemoveCollection}
					{game}
				/>
			{/each}
		</div>
		<!-- <Pagination
			{pageSize}
			{currentPage}
			{totalItems}
			forwardText="Next"
			backwardText="Prev"
			pageSizes={[10, 25, 50, 100]}
			on:nextPageEvent={handleNextPageEvent}
			on:previousPageEvent={(event) => console.log('Prev page called', event)}
			on:perPageEvent={(event) => console.log('Per page called', event)}
		/> -->
	</div>
{/if}

<style lang="scss">
	.game-search {
		display: grid;
		gap: 2rem;

		section {
			display: grid;
			gap: 1rem;
		}
	}

	.games {
		margin: 2rem 0rem;

		h1 {
			margin-bottom: 2rem;
		}
	}

	.games-list {
		display: grid;
		--listColumns: 4;
		grid-template-columns: repeat(var(--listColumns), minmax(200px, 1fr));
		gap: 2rem;

		@media (max-width: 1200px) {
			--listColumns: 3;
		}

		@media (max-width: 800px) {
			--listColumns: 2;
		}

		@media (max-width: 650px) {
			--listColumns: 1;
		}
	}

	.random-buttons {
		display: flex;
		place-content: space-between;
		place-items: center;

		@media (max-width: 650px) {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
