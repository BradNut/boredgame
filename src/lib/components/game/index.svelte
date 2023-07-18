<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Image } from 'svelte-lazy-loader';
	import { fade } from 'svelte/transition';
	import plusCircle from '@iconify-icons/line-md/plus-circle';
	import minusCircle from '@iconify-icons/line-md/minus-circle';
	import { superForm } from 'sveltekit-superforms/client';
	// import Button from '$lib/components/button/index.svelte';
	import type { GameType, SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import { addToCollection, removeFromCollection } from '$lib/util/manipulateCollection';
	import { addToWishlist } from '$lib/util/manipulateWishlist';
	import { browser } from '$app/environment';
  import { binarySearchOnStore } from '$lib/util/binarySearchOnStore';
  import { convertToSavedGame } from '$lib/util/gameMapper';
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$components/ui/card';
	import { Button } from '$components/ui/button';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ListGameSchema } from '$lib/zodValidation';
	import type { CollectionItem } from '@prisma/client';

	export let data: SuperValidated<ListGameSchema>;
	export let game: GameType | CollectionItem;
	export let detailed: boolean = false;

	const { form, errors, enhance, delayed } = superForm(data);

	const dispatch = createEventDispatcher();

	function removeGameFromWishlist() {
		dispatch('handleRemoveWishlist', game);
	}

	function removeGameFromCollection() {
		dispatch('handleRemoveCollection', game);
	}

	function onCollectionClick() {
		if (existsInCollection) {
			removeGameFromCollection();
		} else {
			let index = binarySearchOnStore($collectionStore, convertToSavedGame(game), 'en');
			addToCollection(game, index);
			if (browser) {
				localStorage.collection = JSON.stringify($collectionStore);
			}
		}
	}

	function onWishlistClick() {
		if (existsInWishlist) {
			removeGameFromWishlist();
		} else {
			addToWishlist(game);
			if (browser) {
				localStorage.wishlist = JSON.stringify($wishlistStore);
			}
		}
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

	// $: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
	// $: existsInWishlist = $wishlistStore.find((item: SavedGameType) => item.id === game.id);
	$: existsInCollection = game.in_collection;
	$: existsInWishlist = game.in_wishlist;
	$: collectionText = existsInCollection ? 'Remove from collection' : 'Add to collection';
	$: wishlistText = existsInWishlist ? 'Remove from wishlist' : 'Add to wishlist';
</script>

<article class="grid grid-template-cols-2 gap-4" transition:fade>
	<Card>
		<CardHeader>
			<CardTitle>{game.game_name}</CardTitle>
		</CardHeader>
		<CardContent>
			<a
				class="thumbnail"
				href={`/game/${game.game_id}`}
				title={`View ${game.game_name}`}
				data-sveltekit-preload-data
			>
				<img src={game.thumb_url} alt={`Image of ${game.game_name}`} loading="lazy" decoding="async" />
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
		<CardFooter>
			<div class="grid gap-2 place-items-center">
				<form method="POST" use:enhance action={`/collection?/${existsInCollection ? 'remove' : 'add'}`}>
					<input type="hidden" name="id" value={game.id} />
					<Button variant={existsInCollection ? 'destructive' : 'default'} on:click={onCollectionClick}>
						{collectionText}
						{#if existsInCollection}
							<iconify-icon class="ml-2" icon={minusCircle} width="24" height="24" />
						{:else}
							<iconify-icon class="ml-2" icon={plusCircle} width="24" height="24" />
						{/if}
					</Button>
				</form>
				<form method="POST" use:enhance action={`/wishlist?/${existsInWishlist ? 'remove' : 'add'}`}>
					<input type="hidden" name="id" value={game.id} />
					<Button variant={existsInWishlist ? 'destructive' : 'default'} on:click={onWishlistClick}>
						{wishlistText}
						{#if existsInWishlist}
							<iconify-icon class="ml-2" icon={minusCircle} width="24" height="24" />
						{:else}
							<iconify-icon class="ml-2" icon={plusCircle} width="24" height="24" />
						{/if}
					</Button>
				</form>
			</div>
		</CardFooter>
	</Card>
</article>

<!-- <article class="game-container" transition:fade>
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
