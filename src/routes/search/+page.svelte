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
	let submitButton: HTMLElement;
	console.log('Search page total count: ', totalItems);

	$: if (data?.games) {
		gameStore.removeAll();
		gameStore.addAll(data?.games);
	}

	$: if (form?.games) {
		gameStore.removeAll();
		gameStore.addAll(form?.games);
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
		// document.getElementById('skip')?.setAttribute('value', `${page * pageSize}`);
		console.log('New skip value DOM: ', document.getElementById('skip')?.getAttribute('value'));
		submitButton.click();
		// document.getElementById('search-submit')?.click();
	}
</script>

<div class="game-search">
	<TextSearch showButton advancedSearch />
</div>

<!-- {#if $gameStore?.length > 0}
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
	</div>
{:else if form && form?.status && form.status !== 200}
	<h1>There was an error searching for games!</h1>
	<h2>Please try again later.</h2>
{/if} -->
<style lang="scss">
</style>
