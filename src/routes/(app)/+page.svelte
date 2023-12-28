<script lang="ts">
	// import TextSearch from '$lib/components/search/textSearch/header.svelte';
	import RandomSearch from '$lib/components/search/random/index.svelte';
	import Game from '$components/Game.svelte';
	import logo from '$lib/assets/bored-game.png';

	// import Random from '$lib/components/random/header.svelte';

	export let data;

	const { randomGames } = data;
</script>

<h1>Search Boardgames!</h1>
<div class="game-search">
	<section>
		<p style="margin: 1rem 0;">
			Input your requirements to search for board games that match your criteria.
		</p>
		<p>Or pick a random game!</p>
		<div class="random-buttons">
			<RandomSearch data={data.form} />
			<!-- <Random /> -->
		</div>
	</section>
	<!-- <TextSearch showButton advancedSearch data={data.form} /> -->
</div>

<section class="random-games">
	{#each randomGames as game (game.id)}
		<Game variant='compact' {game} />
	{/each}
</section>

<style lang="postcss">
	.game-search {
		display: grid;
		gap: 2rem;

		section {
			display: grid;
			gap: 1rem;
		}
	}

	.random-games {
		margin-top: 1rem;
		display: grid;
		gap: 0.5rem;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
