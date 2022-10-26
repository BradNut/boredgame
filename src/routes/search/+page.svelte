<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Game from '$lib/components/game/index.svelte';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';
	import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
	import { ToastType, type GameType, type SavedGameType } from '$root/lib/types';
	import { boredState } from '$root/lib/stores/boredState';
	import { toast } from '$root/lib/components/toast/toast';

	export let data: PageData;
	export let form: ActionData;
	console.log('search page form', form);
	console.log('search page data stuff', data);
	let gameToRemove: GameType | SavedGameType;

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

	function handleRemoveGame(event: RemoveGameEvent) {
		console.log('event', event);
		gameToRemove = event?.detail;
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: gameToRemove }
		}));
	}
</script>

<div class="game-search">
	<form
		action="?/search"
		method="post"
		use:enhance={() => {
			boredState.update((n) => ({ ...n, loading: true }));
			return async ({ result }) => {
				boredState.update((n) => ({ ...n, loading: false }));
				console.log(result);
				// `result` is an `ActionResult` object
				if (result.type === 'error') {
					toast.send('Error!', { duration: 3000, type: ToastType.ERROR, dismissible: true });
					await applyAction(result);
				} else {
					gameStore.removeAll();
					gameStore.addAll(result?.data?.games);
					totalItems = result?.data?.totalCount;
					console.log(`Frontend result: ${JSON.stringify(result)}`);
					toast.send('Sucess!', { duration: 3000, type: ToastType.INFO, dismissible: true });
					await applyAction(result);
				}
			};
		}}
	>
		<TextSearch showButton />
	</form>
</div>

{#if $gameStore?.length > 0}
	<div class="games">
		<h1>Games Found:</h1>
		<div class="games-list">
			{#each $gameStore as game (game.id)}
				<Game on:removeGameEvent={handleRemoveGame} {game} />
			{/each}
		</div>
	</div>
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
