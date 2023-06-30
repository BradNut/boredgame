<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Image } from 'svelte-lazy-loader';
	import minusCircle from '@iconify-icons/line-md/minus-circle';
	import plusCircle from '@iconify-icons/line-md/plus-circle';
	// import {
  // ChevronRightIcon,
	// 	ExternalLinkIcon,
	// 	MinusCircleIcon,
	// 	MinusIcon,
	// 	PlusCircleIcon,
	// 	PlusIcon
	// } from '@rgossiaux/svelte-heroicons/outline';
	import type { GameType, SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import Button from '$lib/components/button/index.svelte';
	import RemoveCollectionDialog from '$lib/components/dialog/RemoveCollectionDialog.svelte';
	import { addToCollection } from '$lib/util/manipulateCollection';
	import type { PageData } from './$types';
	import { boredState } from '$lib/stores/boredState';
	import { browser } from '$app/environment';
	import LinkWithIcon from '$lib/components/LinkWithIcon.svelte';
	import { addToWishlist } from '$lib/util/manipulateWishlist';
	import RemoveWishlistDialog from '$lib/components/dialog/RemoveWishlistDialog.svelte';
  import { binarySearchOnStore } from '$lib/util/binarySearchOnStore';
  import { convertToSavedGame } from '$lib/util/gameMapper';

	$: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
	$: existsInWishlist = $wishlistStore.find((item: SavedGameType) => item.id === game.id);
	$: collectionText = existsInCollection ? 'Remove from collection' : 'Add to collection';
	$: wishlistText = existsInWishlist ? 'Remove from wishlist' : 'Add to wishlist';

	export let data: PageData;
	console.log('data', data);
	// let game: GameType;
	$: ({ game, user } = data);
	// let game = data?.game;
	// export let game: GameType = data?.game;
	let seeMore: boolean = false;
	console.log('game', game);
	// let firstParagraphEnd = 0;
	// if (game?.description?.indexOf('</p>') > 0) {
	// 	firstParagraphEnd = game?.description?.indexOf('</p>') + 4;
	// } else if (game?.description?.indexOf('</ p>') > 0) {
	// 	firstParagraphEnd = game?.description?.indexOf('</ p>') + 5;
	// }

	function onCollectionClick() {
		if (existsInCollection) {
			removeFromCollection();
		} else {
			let index = binarySearchOnStore($collectionStore, convertToSavedGame(game), 'en');
			console.log(`Binary index: ${index}`)
			addToCollection(game, index);
			if (browser) {
				localStorage.collection = JSON.stringify($collectionStore);
			}
		}
	}

	function onWishlistClick() {
		if (existsInWishlist) {
			removeFromWishList();
		} else {
			addToWishlist(game);
			if (browser) {
				localStorage.wishlist = JSON.stringify($wishlistStore);
			}
		}
	}

	function removeFromCollection() {
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: game }
		}));
	}

	function removeFromWishList() {
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveWishlistDialog, additionalData: game }
		}));
	}
</script>

<svelte:head>
	<title>{game?.name} | Bored Game</title>
</svelte:head>

<h2>{game?.name}</h2>

<section class="game">
	<div>
		<a class="thumbnail" href={game.url}>
			<Image src={game.thumb_url} alt={`Image of ${game.name}`} />
			<!-- <img src={game.image_url} alt={`Image of ${game.name}`} /> -->
		</a>
	</div>
	<div style="display: grid; place-items: center; gap: 3rem;">
		<div class="details">
			{#if game?.year_published}
				<p>Year: {game?.year_published}</p>
			{/if}
			{#if game?.min_players && game?.max_players}
				<p>Players: {game.min_players} - {game.max_players}</p>
			{/if}
			{#if game?.playtime}
				<p>Playtime: {game.playtime} minutes</p>
			{/if}
			{#if game?.min_age}
				<p>Minimum Age: {game.min_age}</p>
			{/if}
			<LinkWithIcon external ariaLabel={`Board Game Atlas Link for ${game.name}`} url={game.url}>
				Board Game Atlas
				<!-- <ExternalLinkIcon width="24" height="24" /> -->
			</LinkWithIcon>
		</div>
		{#if user?.username}
			<div style="display: grid; gap: 1.5rem; place-content: center;">
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
			</div>
		{:else}
			<span>
				<a href="/auth/signup">Sign Up</a> or <a href="/auth/signin">Sign In</a> to collect this game
			</span>
		{/if}
	</div>
</section>
{#if game?.description_preview}
	{#if !seeMore}
		<section class="description" style="margin-top: 2rem;" in:fly={{ opacity: 0, x: 100 }} out:fly={{ opacity: 0, x: -100 }}>
			{`${game?.description_preview.substring(0, 250)}...`}
		</section>
	{/if}
	{#if seeMore}
		<div class="overflow-description" in:fly={{ opacity: 0, x: 100 }} out:fade>
			{@html game?.description}
		</div>
	{/if}
	<button class="btn button-icon" type="button" on:click={() => (seeMore = !seeMore)}
		>See
		{#if !seeMore}
			More
			<!-- <PlusIcon width="24" height="24" /> -->
		{:else}
			Less
			<!-- <MinusIcon width="24" height="24" /> -->
		{/if}
	</button>
{:else}
	<section class="description">
		<span>
			{@html game?.description}
		</span>
	</section>
{/if}

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
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		place-content: center;
		p {
			margin: 1rem;
		}

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
