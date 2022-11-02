<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import {
		ExternalLinkIcon,
		MinusCircleIcon,
		MinusIcon,
		PlusCircleIcon,
		PlusIcon
	} from '@rgossiaux/svelte-heroicons/outline';
	import type { GameType, SavedGameType } from '$lib/types';
	import { collectionStore } from '$lib/stores/collectionStore';
	import Button from '$lib/components/button/index.svelte';
	import RemoveCollectionDialog from '$root/lib/components/dialog/RemoveCollectionDialog.svelte';
	import { addToCollection } from '$lib/util/manipulateCollection';
	import type { PageData } from './$types';
	import { boredState } from '$root/lib/stores/boredState';
	import { browser } from '$app/environment';
	import LinkWithIcon from '$root/lib/components/LinkWithIcon.svelte';

	$: existsInCollection = $collectionStore.find((item: SavedGameType) => item.id === game.id);

	export let data: PageData;
	export let game: GameType = data?.game;
	console.log('page game', game);
	let seeMore: boolean = false;
	console.log(game?.description?.indexOf('</p>'));
	let firstParagraphEnd = 0;
	if (game?.description?.indexOf('</p>') > 0) {
		firstParagraphEnd = game?.description?.indexOf('</p>') + 4;
	} else if (game?.description?.indexOf('</ p>') > 0) {
		firstParagraphEnd = game?.description?.indexOf('</ p>') + 5;
	}
	console.log('firstParagraphEnd', firstParagraphEnd);

	function removeGame() {
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: game }
		}));
		if (browser) {
			localStorage.collection = JSON.stringify($collectionStore);
		}
	}
</script>

<svelte:head>
	<title>{game?.name} | Bored Game</title>
</svelte:head>

<h2>{game?.name}</h2>

<section class="game">
	<div>
		<a class="thumbnail" href={game.url}>
			<img src={game.image_url} alt={`Image of ${game.name}`} />
		</a>
	</div>
	<div style="display: grid; place-items: center;">
		<div class="details">
			<p>Year: {game?.year_published}</p>
			<p>Players: {game.players}</p>
			<p>Playtime: {game.playtime} minutes</p>
			<p>Minimum Age: {game.min_age}</p>
			{#if game?.price !== 0.0}
				<p>Price: ${game?.price}</p>
			{/if}
			<LinkWithIcon external ariaLabel={`Board Game Atlas Link for ${game.name}`} url={game.url}>
				Board Game Atlas <ExternalLinkIcon width="24" height="24" />
			</LinkWithIcon>
		</div>
		<div>
			{#if existsInCollection}
				<Button size="md" kind="danger" icon on:click={() => removeGame()}>
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
		max-width: 30rem;
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
		margin: 1rem;
		a,
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
	}

	.overflow-description {
		display: grid;
		gap: 1.5rem;
	}

	.with-icon {
		display: grid;
		grid-template-columns: repeat(2, auto);
		/* flex-wrap: wrap; */
		place-items: center;
		gap: 1rem;
	}
</style>
