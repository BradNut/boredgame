<script lang="ts">
	import type { GameType, SavedGameType } from '$lib/types';
	import * as Card from "$lib/components/ui/card";
	import type { CollectionItem } from '@prisma/client';

	export let game: GameType | CollectionItem;
	export let detailed: boolean = false;
	export let variant: 'default' | 'compact' = 'default';

	// Naive and assumes description is only on our GameType at the moment
	function isGameType(game: GameType | SavedGameType): game is GameType {
		return (game as GameType).description !== undefined;
	}
</script>

<article class="grid grid-template-cols-2 gap-4">
	<Card.Root class={variant === 'compact' ? 'game-card-compact' : ''}>
		<Card.Header>
			<Card.Title class="game-card-header">
				<span style:--transition-name="game-name-{game.slug}">
					{game.name}
					{#if game?.year_published}
						({game?.year_published})
					{/if}
				</span>
			</Card.Title>
		</Card.Header>
		<Card.Content class={variant === 'compact' ? 'pt-6' : ''}>
			<a
				class="thumbnail"
				href={`/game/${game.id}`}
				title={`View ${game.name}`}
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
		</Card.Content>
	</Card.Root>
</article>

<style lang="postcss">
	:global(.game-card-compact) {
		display: flex;
		place-items: center;

		.game-card-header {
			span {
				view-transition-name: var(--transition-name);
			}
		}
	}
</style>
