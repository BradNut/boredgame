<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Image } from 'svelte-lazy-loader';
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
			<p>
				<LinkWithIcon external ariaLabel={`Board Game Atlas Link for ${game.name}`} url={game.url}>
					Board Game Atlas <ExternalLinkIcon width="24" height="24" />
				</LinkWithIcon>
			</p>
		</div>
		<div style="display: grid; gap: 1.5rem; place-content: center;">
			{#if existsInCollection}
				<Button size="md" kind="danger" icon on:click={() => removeFromCollection()}>
					Remove from collection <MinusCircleIcon width="24" height="24" />
				</Button>
			{:else}
				<Button
					size="md"
					kind="primary"
					icon
					on:click={() => {
						addToCollection(game);
						if (browser) {
							localStorage.collection = JSON.stringify($collectionStore);
						}
					}}
				>
					Add to collection <PlusCircleIcon width="24" height="24" />
				</Button>
			{/if}
			{#if existsInWishlist}
				<Button size="md" kind="danger" icon on:click={() => removeFromWishList()}>
					Remove from wishlist <MinusCircleIcon width="24" height="24" />
				</Button>
			{:else}
				<Button
					size="md"
					kind="primary"
					icon
					on:click={() => {
						addToWishlist(game);
						if (browser) {
							localStorage.wishlist = JSON.stringify($wishlistStore);
						}
					}}
				>
					Add to wishlist <PlusCircleIcon width="24" height="24" />
				</Button>
			{/if}
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

		@media (max-width: 650px) {
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

		@media (max-width: 550px) {
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
