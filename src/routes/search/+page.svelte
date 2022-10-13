<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import Game from '$lib/components/game/index.svelte';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
	import type { GameType, SavedGameType } from '$root/lib/types';
	import { boredState } from '$root/lib/stores/boredState';

	export let data: PageData;
	export let form: ActionData;
	console.log('search page form', form);
	console.log('search page data stuff', data);
	let gameToRemove: GameType | SavedGameType;

	$: if (data?.games) {
		gameStore.removeAll();
		gameStore.addAll(data?.games);
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

<h1>Search</h1>

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
