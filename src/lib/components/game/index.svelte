<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Image } from 'svelte-lazy-loader';
	import { fade } from 'svelte/transition';
	import { MinusCircleIcon, PlusCircleIcon } from '@rgossiaux/svelte-heroicons/outline';
	import type { GameType, SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$root/lib/stores/wishlistStore';
	import { addToCollection, removeFromCollection } from '$lib/util/manipulateCollection';
	import { addToWishlist } from '$lib/util/manipulateWishlist';
	import { browser } from '$app/environment';

	export let game: GameType | SavedGameType;
	export let detailed: boolean = false;

	const dispatch = createEventDispatcher();

	function removeGameFromWishlist() {
		dispatch('handleRemoveWishlist', game);
	}

	function removeGameFromCollection() {
		dispatch('handleRemoveCollection', game);
	}

	// Naive and assumes description is only on our GameType at the moment
	function isGameType(game: GameType | SavedGameType): game is GameType {
		return (game as GameType).description !== undefined;
	}

	// function lazy(img: HTMLImageElement) {
	// 	function loaded() {
	// 		img.classList.add('loaded');
	// 		img.classList.remove('loading');
	// 	}
	// 	if (img.complete) {
	// 		loaded();
	// 	} else {
	// 		img.classList.add('loading');
	// 		img.onload = () => loaded();
	// 	}
	// }

	$: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
	$: existsInWishlist = $wishlistStore.find((item: SavedGameType) => item.id === game.id);
</script>

<article class="game-container" transition:fade>
	<h2>{game.name}</h2>
	<a
		class="thumbnail"
		href={`/game/${game.id}`}
		title={`View ${game.name}`}
		data-sveltekit-preload-data
	>
		<!-- <Image src={game.thumb_url} alt={`Image of ${game.name}`} /> -->
		<img src={game.thumb_url} alt={`Image of ${game.name}`} loading="lazy" decoding="async" />
		<!-- loading="lazy" decoding="async" -->
	</a>

	<div class="game-details">
		<p>Players: {game.players}</p>
		<p>Time: {game.playtime} minutes</p>
		{#if isGameType(game) && game?.min_age}
			<p>Min Age: {game.min_age}</p>
		{/if}
		{#if detailed && isGameType(game) && game?.description}
			<div class="description">{@html game.description}</div>
		{/if}
	</div>

	<div class="game-buttons">
		{#if existsInCollection}
			<button
				aria-label="Remove from collection"
				class="btn remove"
				type="button"
				on:click={() => {
					removeGameFromCollection();
				}}><span>Remove from Collection</span> <MinusCircleIcon width="24" height="24" /></button
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
				}}><span>Add to collection</span> <PlusCircleIcon width="24" height="24" /></button
			>
		{/if}
		{#if existsInWishlist}
			<button
				aria-label="Remove from wishlist"
				class="btn remove"
				type="button"
				on:click={() => {
					removeGameFromWishlist();
				}}><span>Remove from Wishlist</span> <MinusCircleIcon width="24" height="24" /></button
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
				}}><span>Add to wishlist</span> <PlusCircleIcon width="24" height="24" /></button
			>
		{/if}
	</div>
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
		display: grid;
		grid-template-rows: repeat(auto-fill, 1fr);
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
		&:hover {
			background-color: hsla(222, 9%, 65%, 1);
		}

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

			.btn {
				max-height: 100px;
				text-align: start;
			}

			.remove {
				background-color: var(--warning);

				&:hover {
					background-color: var(--warning-hover);
				}
			}
		}
	}
</style>
