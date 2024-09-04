<script lang="ts">
	import { Image } from 'svelte-lazy-loader';
	import { Dices, ExternalLinkIcon, MinusIcon, PlusIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { Button } from '$components/ui/button';
	import AddToList from '$components/AddToList.svelte';
	import Badge from '$components/ui/badge/badge.svelte';

	const { data } = $props();
	const { game, user, in_collection, in_wishlist } = data;

	let seeMore: boolean = $state(false);
</script>

<svelte:head>
	<title>{game?.name} | Bored Game</title>
</svelte:head>

<h2 style:--transition-name="game-name-{game.slug}">{game?.name}
	{#if game?.year_published}
		({game?.year_published})
	{/if}
</h2>

<section class="game">
	<div>
			{#if game?.image_url && game?.name}
				<Image src={game.image_url} alt={`Image of ${game.name}`} />
			{:else}
				<Dices />
			{/if}
	</div>
	<div style="display: grid; place-items: center; gap: 3rem;">
		<div class="details">
			{#if game?.min_players && game?.max_players}
				<p>Players: {game.min_players} - {game.max_players}</p>
			{/if}
			{#if game?.playtime}
				<p>Playtime: {game.playtime} minutes</p>
			{/if}
			{#if game?.min_age}
				<p>Minimum Age: {game.min_age}</p>
			{/if}
			{#if game?.min_playtime && game?.max_playtime}
				<p>Playtime: {game.min_playtime} - {game.max_playtime} minutes</p>
			{/if}
			<Button class="text-secondary-foreground p-0" variant="link" href={game.url} title="View on BoardGameGeek" target="_blank">
				View on BoardGameGeek <ExternalLinkIcon class="mr-2 h-4 w-4" />
			</Button>
		</div>
		{#if user?.username}
			<AddToList {in_collection} {in_wishlist} game_id={game.id} {wishlist} {collection} />
		{:else}
			<span>
				<Button href="/signup">Sign Up</Button> or <Button href="/login">Sign In</Button> to add to a list.
			</span>
		{/if}
	</div>
</section>
<section>
	<p>Categories</p>
	<div style='display: flex; gap: 0.25rem;'>
		{#each game?.categories as category}
			<Badge>{category.name}</Badge>
		{/each}
	</div>
</section>
<section>
	<p>Mechanics</p>
	<div style='display: flex; gap: 0.25rem;'>
	{#each game?.mechanics as mechanic}
		<Badge>{mechanic.name}</Badge>
	{/each}
	</div>
</section>
<section class="description" class:show={seeMore} class:hide={!seeMore} style="margin-top: 2rem;">
	{@html game?.description}
</section>
<button class="btn button-icon" type="button" onclick={() => (seeMore = !seeMore)}
	>See
	{#if !seeMore}
		More
		<PlusIcon width="24" height="24" />
	{:else}
		Less
		<MinusIcon width="24" height="24" />
	{/if}
</button>
<section>
	<p>Expansion Of</p>
	<ul style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
	{#each game?.expansion_of as expansion}
		<li>
			<a href={`/game/${expansion?.base_game?.id}`}>
				{expansion?.base_game?.name}
			</a>
		</li>
	{/each}
	</ul>
</section>
<section>
	<p>Expansions</p>
	<ul style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
	{#each game?.expansions as expansion}
		<li>
			<a href={`/game/${expansion?.game?.id}`}>
				{expansion?.game?.name}
			</a>
		</li>
	{/each}
	</ul>
</section>

<style lang="scss">
	h2 {
		text-align: center;
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 3rem;
	}

	button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 4px;
		margin: 0;
		padding: 1rem;
		max-width: 25rem;
		background-color: var(--color-btn-primary-active);
	}

	.remove {
		background-color: var(--warning);

		&:hover {
			background-color: var(--warning-hover);
		}
	}

	.button-icon {
		display: grid;
		grid-template-columns: repeat(2, auto);
		gap: 1rem;
	}

	.game {
		display: grid;
		grid-template-columns: minmax(auto, 400px) 1fr;
		gap: 2rem;
		margin: 1rem;
		place-items: center;

		@media (max-width: 700px) {
			grid-template-columns: 1fr;
			place-items: center;
		}
	}

	.details {
		display: flex;
		/* grid-template-columns: 1fr 1fr; */
		flex-direction: column;
		gap: 1rem;
		/* align-items: center; */

		@media (max-width: 500px) {
			grid-template-columns: 1fr;
		}
	}

	.description {
		display: grid;
		place-items: center;
		gap: 1.5rem;
		margin: 1rem;
		line-height: 1.75em;

		&.show {
			max-height: auto;
		}

		&.hide {
			max-height: 300px;
			overflow: hidden;
		}
	}

	.overflow-description {
		display: grid;
		gap: 1.5rem;
	}

	.with-icon {
		display: grid;
		grid-template-columns: repeat(2, auto);
		place-items: center;
		gap: 1rem;
	}
</style>
