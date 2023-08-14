<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { GameType, SavedGameType } from '$lib/types';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
	import { Button } from '$components/ui/button';
	import type { CollectionItem } from '@prisma/client';

	// export let data: SuperValidated<ListGameSchema>;
	export let game: GameType | CollectionItem;
	export let detailed: boolean = false;

	// Naive and assumes description is only on our GameType at the moment
	function isGameType(game: GameType | SavedGameType): game is GameType {
		return (game as GameType).description !== undefined;
	}
</script>

<article class="grid grid-template-cols-2 gap-4" transition:fade|global>
	<Card>
		<CardHeader>
			<CardTitle>{game.name}</CardTitle>
		</CardHeader>
		<CardContent>
			<a
				class="thumbnail"
				href={`/game/${game.id}`}
				title={`View ${game.game_name}`}
				data-sveltekit-preload-data
			>
				<img src={game.thumb_url} alt={`Image of ${game.name}`} loading="lazy" decoding="async" />
				<div class="game-details">
					{#if game?.players}
						<p>Players: {game.players}</p>
						<p>Time: {game.playtime} minutes</p>
						{#if isGameType(game) && game?.min_age}
							<p>Min Age: {game.min_age}</p>
						{/if}
						{#if detailed && isGameType(game) && game?.description}
							<div class="description">{@html game.description}</div>
						{/if}
					{/if}
				</div>
			</a>
		</CardContent>
	</Card>
</article>

<!-- <article class="game-container" transition:fade|global>
	<h2>{game.name}</h2>
	<a
		class="thumbnail"
		href={`/game/${game.id}`}
		title={`View ${game.name}`}
		data-sveltekit-preload-data
	>
		<!-- <Image src={game.thumb_url} alt={`Image of ${game.name}`} /> -->
		<!-- <img src={game.thumb_url} alt={`Image of ${game.name}`} loading="lazy" decoding="async" /> -->
		<!-- loading="lazy" decoding="async" -->
	<!-- </a> -->

		<!-- <div class="game-details">
			{#if game?.players}
				<p>Players: {game.players}</p>
				<p>Time: {game.playtime} minutes</p>
				{#if isGameType(game) && game?.min_age}
					<p>Min Age: {game.min_age}</p>
				{/if}
				{#if detailed && isGameType(game) && game?.description}
					<div class="description">{@html game.description}</div>
				{/if}
			{/if}
		</div>

	<div class="game-buttons">
		<Button size="md" kind={existsInCollection ? 'danger' : 'primary'} icon on:click={onCollectionClick}>
			{collectionText}
			{#if existsInCollection}
				<iconify-icon icon={minusCircle} width="24" height="24" />
			{:else}
				<iconify-icon icon={plusCircle} width="24" height="24" />
			{/if}
		</Button>
		<Button size="md" kind={existsInWishlist ? 'danger' : 'primary'} icon on:click={onWishlistClick}>
			{wishlistText}
			{#if existsInWishlist}
				<iconify-icon icon={minusCircle} width="24" height="24" />
			{:else}
				<iconify-icon icon={plusCircle} width="24" height="24" />
			{/if}
		</Button>
	</div> -->
<!-- </article> -->

<style lang="scss">
	.game-container {
		display: grid;
		/* grid-template-rows: repeat(auto-fill, 1fr); */
		grid-template-rows: 0.15fr minmax(250px, 1fr) 0.2fr 0.2fr;
		place-items: center;
		text-align: center;

		@media (max-width: 650px) {
			max-width: none;
		}

		gap: var(--spacing-16);
		padding: var(--spacing-16) var(--spacing-16);
		transition: all 0.3s;
		border-radius: 8px;
		background-color: var(--primary);
		/* &:hover {
			background-color: hsla(222, 9%, 65%, 1);
		} */

		/* .game-info {
			display: grid;
			place-items: center;
			gap: 0.75rem;
			margin: 0.2rem;
		} */

		.game-details {
			p,
			a {
				padding: 0.25rem;
			}
		}

		.game-buttons {
			display: grid;
			gap: 1rem;
		}
	}
</style>
