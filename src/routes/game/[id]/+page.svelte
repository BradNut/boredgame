<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Image } from 'svelte-lazy-loader';
	import minusCircle from '@iconify-icons/line-md/minus-circle';
	import plusCircle from '@iconify-icons/line-md/plus-circle';
	import type { SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import { wishlistStore } from '$lib/stores/wishlistStore';
	import type { PageData } from './$types';
	import LinkWithIcon from '$lib/components/LinkWithIcon.svelte';
	import { Button } from '$components/ui/button';
	import AddToList from '$components/AddToList.svelte';
	import { Dices } from 'lucide-svelte';

	$: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);
	$: existsInWishlist = $wishlistStore.find((item: SavedGameType) => item.id === game.id);
	$: collectionText = existsInCollection ? 'Remove from collection' : 'Add to collection';
	$: wishlistText = existsInWishlist ? 'Remove from wishlist' : 'Add to wishlist';

	export let data: PageData;
	console.log('data', data);

	$: ({ game, user, wishlist, collection, in_collection, in_wishlist } = data);

	let seeMore: boolean = false;
	console.log('game', game);
</script>

<svelte:head>
	<title>{game?.name} | Bored Game</title>
</svelte:head>

<h2>{game?.name}</h2>

<section class="game">
	<div>
		<a class="thumbnail" href={game.url}>
			{#if game?.thumb_url}
				<Image src={game.thumb_url} alt={`Image of ${game.name}`} />
			{:else}
				<Dices />
			{/if}
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
			<AddToList {in_collection} {in_wishlist} game_id={game.id} {wishlist} {collection} />
		{:else}
			<span>
				<Button href="/auth/signup">Sign Up</Button> or <Button href="/auth/signin">Sign In</Button> to add to a list.
			</span>
		{/if}
	</div>
</section>
{#if game?.description_preview}
	{#if !seeMore}
		<section class="description" style="margin-top: 2rem;" in:fly|global={{ opacity: 0, x: 100 }} out:fly|global={{ opacity: 0, x: -100 }}>
			{`${game?.description_preview.substring(0, 250)}...`}
		</section>
	{/if}
	{#if seeMore}
		<div class="overflow-description" in:fly|global={{ opacity: 0, x: 100 }} out:fade|global>
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
