<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Image } from 'svelte-lazy-loader';
	import minusCircle from '@iconify-icons/line-md/minus-circle';
	import plusCircle from '@iconify-icons/line-md/plus-circle';
	import {
  ChevronRightIcon,
		ExternalLinkIcon,
		MinusCircleIcon,
		MinusIcon,
		PlusCircleIcon,
		PlusIcon
	} from '@rgossiaux/svelte-heroicons/outline';
	import type { GameType, SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import Button from '$lib/components/button/index.svelte';
	import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
	import { addToCollection } from '$lib/util/manipulateCollection';
	import type { PageData } from './$types';
	import { boredState } from '$root/lib/stores/boredState';
	import { browser } from '$app/environment';
	import LinkWithIcon from '$root/lib/components/LinkWithIcon.svelte';
	import { addToWishlist } from '$root/lib/util/manipulateWishlist';
	import RemoveWishlistDialog from '$root/lib/components/dialog/RemoveWishlistDialog.svelte';

	$: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
	$: existsInWishlist = $wishlistStore.find((item: SavedGameType) => item.id === game.id);
	$: collectionText = existsInCollection ? 'Remove from collection' : 'Add to collection';
	$: wishlistText = existsInWishlist ? 'Remove from wishlist' : 'Add to wishlist';

	export let data: PageData;
	let game: GameType;
	$: ({ game } = data);
	// export let game: GameType = data?.game;
	let seeMore: boolean = false;
	let firstParagraphEnd = 0;
	if (game?.description?.indexOf('</p>') > 0) {
		firstParagraphEnd = game?.description?.indexOf('</p>') + 4;
	} else if (game?.description?.indexOf('</ p>') > 0) {
		firstParagraphEnd = game?.description?.indexOf('</ p>') + 5;
	}

	function onCollectionClick() {	
		if (existsInCollection) {
			removeFromCollection();
		} else {
			addToCollection(game);
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
			{#if game?.players}
				<p>Players: {game.players}</p>
			{/if}
			{#if game?.playtime}
				<p>Playtime: {game.playtime} minutes</p>
			{/if}
			{#if game?.min_age}
				<p>Minimum Age: {game.min_age}</p>
			{/if}
			{#if +game?.price !== 0.0}
				<p>Price: ${game?.price}</p>
			{/if}
			<LinkWithIcon external ariaLabel={`Board Game Atlas Link for ${game.name}`} url={game.url}>
				Board Game Atlas <ExternalLinkIcon width="24" height="24" />
			</LinkWithIcon>
		</div>
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
	</div>
</section>
{#if firstParagraphEnd > 0}
	<section class="description" style="margin-top: 2rem;">
		{@html game?.description?.substring(0, firstParagraphEnd)}
	</section>
	{#if game?.description?.substring(firstParagraphEnd + 1) !== ''}
		<section class="description">
			{#if seeMore}
				<div class="overflow-description" in:fly={{ opacity: 0, x: 100 }} out:fade>
					{@html game?.description?.substring(firstParagraphEnd + 1)}
				</div>
			{/if}
			<button class="btn button-icon" type="button" on:click={() => (seeMore = !seeMore)}
				>See
				{#if !seeMore}
					More <PlusIcon width="24" height="24" />
				{:else}
					Less <MinusIcon width="24" height="24" />
				{/if}
			</button>
		</section>
	{/if}
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

		@media (max-width: env(--medium-viewport)) {
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

		@media (max-width: env(--xsmall-viewport)) {
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
