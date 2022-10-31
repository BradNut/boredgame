<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { MinusCircleIcon, PlusCircleIcon } from '@rgossiaux/svelte-heroicons/outline';
	import type { GameType, SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$root/lib/stores/wishlistStore';
	import { addToCollection, removeFromCollection } from '$lib/util/manipulateCollection';
	import { addToWishlist } from '$lib/util/manipulateWishlist';
	import { browser } from '$app/environment';

	export let game: GameType | SavedGameType;
	export let minimal: boolean = false;
	export let detailed: boolean = false;

	const dispatch = createEventDispatcher();

	function removeGameFromWishlist() {
		dispatch('handleRemoveWishlist', game);
	}

	function removeGameFromCollection() {
		dispatch('handleRemoveCollection', game);
	}

	$: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
	$: existsInWishlist = $wishlistStore.find((item: SavedGameType) => item.id === game.id);
</script>

<article class="game-container" transition:fade>
	<div class="game-info">
		<h2>{game.name}</h2>
		<a class="thumbnail" href={`/game/${game.id}`}>
			<img src={game.thumb_url} alt={`Image of ${game.name}`} />
		</a>
	</div>

	{#if !minimal && game?.players && game?.playtime}
		<div class="game-details">
			{#if game.year_published}
				<p>{game.year_published}</p>
			{/if}
			<p>{game.players} {game.max_players === 1 ? 'player' : 'players'}</p>
			<p>{game.playtime} minutes</p>
			<p>Minimum Age: {game.min_age}</p>
			<!-- <a href={`/game/${game.id}`}>View Game</a> -->
			{#if detailed}
				<div class="description">{@html game.description}</div>
			{/if}
		</div>
	{/if}
	{#if existsInCollection}
		<button
			aria-label="Remove from collection"
			class="btn"
			type="button"
			on:click={() => {
				removeGameFromCollection();
			}}>Remove from Collection <MinusCircleIcon width="24" height="24" /></button
		>
	{:else}
		<button
			aria-label="Add to collection"
			class="btn"
			type="button"
			on:click={() => {
				addToCollection(game);
				if (browser) {
					localStorage.collection = JSON.stringify($collectionStore);
				}
			}}>Add to collection <PlusCircleIcon width="24" height="24" /></button
		>
	{/if}
	{#if existsInWishlist}
		<button
			aria-label="Remove from wishlist"
			class="btn"
			type="button"
			on:click={() => {
				removeGameFromWishlist();
			}}>Remove from Wishlist <MinusCircleIcon width="24" height="24" /></button
		>
	{:else}
		<button
			aria-label="Add to wishlist"
			class="btn"
			type="button"
			on:click={() => {
				addToWishlist(game);
				if (browser) {
					localStorage.wishlist = JSON.stringify($wishlistStore);
				}
			}}>Add to wishlist <PlusCircleIcon width="24" height="24" /></button
		>
	{/if}
</article>

<style lang="scss">
	img {
		max-height: 200px;
	}

	button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		width: 100%;
		border-radius: 10px;
		padding: 1rem;
		background-color: var(--color-btn-primary-active);
	}

	.game-container {
		display: flex;
		place-content: center;
		flex-wrap: wrap;

		@media (max-width: 650px) {
			max-width: none;
		}

		gap: var(--spacing-16);
		padding: var(--spacing-16) var(--spacing-16);
		transition: all 0.3s;
		border-radius: 8px;
		background-color: var(--primary);
		&:hover {
			background-color: hsla(222, 9%, 65%, 1);
		}

		.game-info {
			display: grid;
			place-items: center;
			gap: 0.75rem;
			margin: 0.2rem;
		}

		.game-details {
			p,
			a {
				padding: 0.25rem;
			}
		}

		.btn {
			max-height: 50px;
		}
	}
</style>
