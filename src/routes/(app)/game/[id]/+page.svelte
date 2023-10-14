<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Image } from 'svelte-lazy-loader';
	import { Dices, ExternalLinkIcon, MinusIcon, PlusIcon } from 'lucide-svelte';
	import type { SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import type { PageData } from './$types';
	import { Button } from '$components/ui/button';
	import AddToList from '$components/AddToList.svelte';

	$: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
	$: existsInWishlist = $wishlistStore.find((item: SavedGameType) => item.id === game.id);
	$: collectionText = existsInCollection ? 'Remove from collection' : 'Add to collection';
	$: wishlistText = existsInWishlist ? 'Remove from wishlist' : 'Add to wishlist';

	export let data: PageData;
	console.log('data', data);

	$: ({ game, user, wishlist, collection, in_collection, in_wishlist } = data);

	let seeMore: boolean = false;
</script>

<svelte:head>
	<title>{game?.name} | Bored Game</title>
</svelte:head>

<h2>{game?.name}
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
				<Button href="/sign-up">Sign Up</Button> or <Button href="/login">Sign In</Button> to add to a list.
			</span>
		{/if}
	</div>
</section>
<section class="description" class:show={seeMore} class:hide={!seeMore} style="margin-top: 2rem;">
	{@html game?.description}
</section>
<button class="btn button-icon" type="button" on:click={() => (seeMore = !seeMore)}
	>See
	{#if !seeMore}
		More
		<PlusIcon width="24" height="24" />
	{:else}
		Less
		<MinusIcon width="24" height="24" />
	{/if}
</button>

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
