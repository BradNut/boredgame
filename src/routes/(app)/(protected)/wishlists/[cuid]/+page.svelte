<script lang="ts">
import Game from '$components/Game.svelte'

export let data
console.log('data', data)
const items = data.items || []
</script>

<svelte:head>
	<title>{`Your Wishlist | Bored Game`}</title>
</svelte:head>

<h1>Your wishlist</h1>

<div class="games-list">
	{#if items.length > 0}
		{#each items as item (item.id)}
			<Game game={item.game} />
		{/each}
	{:else}
		<h2>Sorry no gamesTable found!</h2>
	{/if}
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