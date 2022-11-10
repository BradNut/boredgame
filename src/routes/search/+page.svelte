<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: if (data?.games) {
		gameStore.removeAll();
		gameStore.addAll(data?.games);
	}

	$: if (form?.games) {
		gameStore.removeAll();
		gameStore.addAll(form?.games);
	}
</script>

<div class="game-search">
	<TextSearch showButton advancedSearch {data} {form} />
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
