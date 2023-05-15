<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import TextSearch from '$lib/components/search/textSearch/index.svelte';
	import RandomSearch from '$lib/components/search/random/index.svelte';
	import Random from '$lib/components/random/index.svelte';

	export let data;
	const { form, errors, constraints } = superForm(data?.form);
</script>

<svelte:head>
	<title>Bored Game | Home</title>
</svelte:head>

<h1>Search Boardgames!</h1>
<div class="game-search">
	<section>
		<p style="margin: 1rem 0;">
			Input your requirements to search for board games that match your criteria.
		</p>
		<p>Or pick a random game!</p>
		<div class="random-buttons">
			<RandomSearch />
			<Random />
		</div>
	</section>
	<TextSearch showButton advancedSearch {form} {errors} {constraints} />
</div>

<style lang="scss">
	.game-search {
		display: grid;
		gap: 2rem;

		section {
			display: grid;
			gap: 1rem;
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
