<script lang="ts">
import Game from '$components/Game.svelte'

const { data } = $props()
const { items = [] } = data
</script>

<svelte:head>
	<title>{`Your Wishlist | Bored Game`}</title>
</svelte:head>

<div class="container">
	<h1>Your wishlist</h1>

	<div class="games-list">
		{#if items.length > 0}
			{#each items as item (item.id)}
				<Game game={item.game} />
			{/each}
		{:else}
			<h2>Sorry no games found!</h2>
		{/if}
	</div>
</div>

<style lang="postcss">
	h1 {
		margin: 1.5rem 0;
	}

	.container {
		display: grid;
		place-content: center;
		max-width: 900px;
		gap: 0.25rem;
		margin-left: auto;
		margin-right: auto;
	}

	.games {
		margin: 2rem 0;
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