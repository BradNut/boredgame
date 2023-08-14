<script lang="ts">
	import Game from '$lib/components/game/index.svelte';

	export let data;
	console.log('data', data);
	const wishlist = data.wishlist;
	const gamesItems = wishlist?.items;
</script>

<svelte:head>
	<title>{`Wishlist ${wishlist.name} | Bored Game`}</title>
</svelte:head>

<h1>{wishlist.name}</h1>
<h2>Games on your wishlist:</h2>
<div class="games-list">
	{#if gamesItems.length > 0}
		{#each gamesItems as game (game.id)}
			<Game {game} />
		{/each}
	{:else}
		<h2>Sorry no games found!</h2>
	{/if}
</div>