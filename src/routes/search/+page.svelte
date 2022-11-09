<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { ToastType, type GameType, type SavedGameType } from '$root/lib/types';
	import type { ActionData, PageData } from './$types';
	import Game from '$lib/components/game/index.svelte';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';
	import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
	import { boredState } from '$root/lib/stores/boredState';
	import { toast } from '$root/lib/components/toast/toast';
	import Pagination from '$lib/components/pagination/index.svelte';
	import RemoveWishlistDialog from '$root/lib/components/dialog/RemoveWishlistDialog.svelte';

	export let data: PageData;
	console.log('search page data', data);
	export let form: ActionData;
	console.log('search page form', form);

	let gameToRemove: GameType | SavedGameType;
	let pageSize = 10;
	console.log('Form data page', +form?.data?.page);
	let page = +form?.data?.page || 1;
	$: skip = (page - 1) * pageSize;
	console.log({ skip });
	let totalItems = form?.totalCount || data?.totalCount || 0;
	console.log({ pageSize });
	console.log({ page });
	console.log({ totalItems });
	let submitting = $boredState?.loading;
	let numberOfGameSkeleton = 1;
	console.log('Search page total count: ', totalItems);

	$: if (data?.games) {
		gameStore.removeAll();
		gameStore.addAll(data?.games);
	}

	$: if (form?.games) {
		gameStore.removeAll();
		gameStore.addAll(form?.games);
	}

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

	function handleNextPageEvent(event: CustomEvent) {
		console.log('Next page called', event.detail);
		console.log('Current page: ', page);
		if (+event?.detail?.page === page + 1) {
			console.log('Page equals plus one');
			page += 1;
		}
		console.log('New page value: ', page);
		console.log('New skip value: ', skip);
		document.getElementById('skip')?.setAttribute('value', `${page * pageSize}`);
		console.log('New skip value DOM: ', document.getElementById('skip')?.getAttribute('value'));
		document.getElementById('search-submit')?.click();
	}
</script>

<div class="game-search">
	{skip}
	<form
		id="search-form"
		action="/search"
		method="post"
		use:enhance={({ data }) => {
			gameStore.removeAll();
			// data.append('limit', pageSize.toString());
			// data.append('skip', Math.floor(page * pageSize).toString());
			boredState.update((n) => ({ ...n, loading: true }));
			return async ({ result }) => {
				boredState.update((n) => ({ ...n, loading: false }));
				console.log(result);
				// `result` is an `ActionResult` object
				if (result.type === 'error') {
					toast.send('Error!', { duration: 3000, type: ToastType.ERROR, dismissible: true });
					await applyAction(result);
				} else if (result.type === 'success') {
					gameStore.removeAll();
					gameStore.addAll(result?.data?.games);
					// totalItems = result?.data?.totalCount;
					console.log(`Frontend result search enhance: ${JSON.stringify(result)}`);
					totalItems = result?.data?.totalCount;
					// skip = result?.data?.skip || 0;
					// page = skip / pageSize || 0;
					// console.log('enhance', page, skip, totalItems);
					toast.send('Sucess!', { duration: 3000, type: ToastType.INFO, dismissible: true });
					await applyAction(result);
				} else {
					await applyAction(result);
				}
			};
		}}
	>
		<input id="skip" type="hidden" name="skip" value={skip} />
		<input id="limit" type="hidden" name="limit" value={pageSize} />
		<TextSearch showButton advancedSearch {form} />
	</form>
</div>

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
		<Pagination
			{pageSize}
			{page}
			{totalItems}
			forwardText="Next"
			backwardText="Prev"
			pageSizes={[10, 25, 50, 100]}
			on:nextPageEvent={handleNextPageEvent}
			on:previousPageEvent={(event) => console.log('Prev page called', event)}
			on:perPageEvent={(event) => console.log('Per page called', event)}
		/>
	</div>
{:else if form && form?.status && form.status !== 200}
	<h1>There was an error searching for games!</h1>
	<h2>Please try again later.</h2>
{/if}

<style lang="scss">
	.games {
		margin: 2rem 0rem;

		h1 {
			margin-bottom: 2rem;
		}
	}

	.games-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(200px, 1fr));
		gap: 2rem;

		@media (max-width: 800px) {
			grid-template-columns: 1fr 1fr;
		}

		@media (max-width: 650px) {
			grid-template-columns: 1fr;
		}
	}
</style>
