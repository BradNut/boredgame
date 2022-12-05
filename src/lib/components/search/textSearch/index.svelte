<script lang="ts">
	import { tick } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';
	import { ChevronRightIcon } from '@rgossiaux/svelte-heroicons/solid';
	import { boredState } from '$lib/stores/boredState';
	import AdvancedSearch from '$lib/components/search/advancedSearch/index.svelte';
	import { xl, md, sm } from '$lib/stores/mediaQueryStore';
	import { gameStore } from '$root/lib/stores/gameSearchStore';
	import { toast } from '../../toast/toast';
	import Pagination from '$lib/components/pagination/index.svelte';
	import Game from '$lib/components/game/index.svelte';
	import { ToastType, type GameType, type SavedGameType } from '$root/lib/types';
	import SkeletonPlaceholder from '../../SkeletonPlaceholder.svelte';
	import RemoveCollectionDialog from '../../dialog/RemoveCollectionDialog.svelte';
	import RemoveWishlistDialog from '../../dialog/RemoveWishlistDialog.svelte';

	interface RemoveGameEvent extends Event {
		detail: GameType | SavedGameType;
	}

	export let data: PageData;
	// console.log('search page data', data);
	export let form: ActionData;
	// console.log('search page form', form);
	const errors = form?.errors;

	export let showButton: boolean = false;
	export let advancedSearch: boolean = false;

	let gameToRemove: GameType | SavedGameType;
	let numberOfGameSkeleton = 1;
	let submitButton: HTMLElement;
	let pageSize = 10;
	let page = +form?.data?.page || 1;
	let totalItems = form?.totalCount || data?.totalCount || 0;
	let submitting = $boredState?.loading;
	let name = form?.name || '';
	let disclosureOpen = errors || false;

	$: skip = (page - 1) * pageSize;
	$: showPagination = $gameStore?.length > 1;

	if ($xl) {
		numberOfGameSkeleton = 8;
	} else if ($md) {
		numberOfGameSkeleton = 3;
	} else if ($sm) {
		numberOfGameSkeleton = 2;
	} else {
		numberOfGameSkeleton = 1;
	}

	let placeholderList = [...Array(numberOfGameSkeleton).keys()];
	console.log(placeholderList);

	if (form?.error) {
		disclosureOpen = true;
	}

	async function handleNextPageEvent(event: CustomEvent) {
		if (+event?.detail?.page === page + 1) {
			page += 1;
		}
		await tick();
		submitButton.click();
	}

	async function handlePreviousPageEvent(event: CustomEvent) {
		if (+event?.detail?.page === page - 1) {
			page -= 1;
		}
		await tick();
		submitButton.click();
	}

	async function handlePerPageEvent(event: CustomEvent) {
		console.log('Per Page Event called', event.detail);
		page = 1;
		pageSize = event.detail.pageSize;
		await tick();
		// console.log('New limit value DOM: ', document.getElementById('limit')?.getAttribute('value'));
		submitButton.click();
	}

	function handleRemoveCollection(event: RemoveGameEvent) {
		gameToRemove = event?.detail;
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveCollectionDialog, additionalData: gameToRemove }
		}));
	}

	function handleRemoveWishlist(event: RemoveGameEvent) {
		gameToRemove = event?.detail;
		boredState.update((n) => ({
			...n,
			dialog: { isOpen: true, content: RemoveWishlistDialog, additionalData: gameToRemove }
		}));
	}

	// TODO: Keep all Pagination Values on back and forth browser
	// TODO: Add cache for certain number of pages so back and forth doesn't request data again
</script>

<form
	id="search-form"
	action="/search"
	method="post"
	use:enhance={() => {
		gameStore.removeAll();
		boredState.update((n) => ({ ...n, loading: true }));
		return async ({ result }) => {
			boredState.update((n) => ({ ...n, loading: false }));
			// `result` is an `ActionResult` object
			if (result.type === 'error') {
				toast.send('Error!', { duration: 3000, type: ToastType.ERROR, dismissible: true });
				await applyAction(result);
			} else if (result.type === 'success') {
				gameStore.removeAll();
				gameStore.addAll(result?.data?.games);
				totalItems = result?.data?.totalCount;
				// toast.send('Sucess!', { duration: 3000, type: ToastType.INFO, dismissible: true });
				await applyAction(result);
			} else {
				await applyAction(result);
			}
		};
	}}
>
	<input id="skip" type="hidden" name="skip" bind:value={skip} />
	<input id="limit" type="hidden" name="limit" bind:value={pageSize} />
	<div class="search">
		<fieldset class="text-search" aria-busy={submitting} disabled={submitting}>
			<label for="name">
				Search
				<input
					id="name"
					name="name"
					bind:value={name}
					type="text"
					aria-label="Search boardgame"
					placeholder="Search boardgame"
				/>
			</label>
		</fieldset>
		{#if advancedSearch}
			<Disclosure>
				<DisclosureButton
					class="disclosure-button"
					on:click={() => (disclosureOpen = !disclosureOpen)}
				>
					<span>Advanced Search?</span>
					<ChevronRightIcon
						class="icon disclosure-icon"
						style={disclosureOpen
							? 'transform: rotate(90deg); transition: transform 0.5s ease;'
							: 'transform: rotate(0deg); transition: transform 0.5s ease;'}
					/>
				</DisclosureButton>

				{#if disclosureOpen}
					<div transition:fade>
						<!-- Using `static`, `DisclosurePanel` is always rendered,
                and ignores the `open` state -->
						<DisclosurePanel static>
							<AdvancedSearch {form} />
						</DisclosurePanel>
					</div>
				{/if}
			</Disclosure>
		{/if}
	</div>
	{#if showButton}
		<button
			id="search-submit"
			class="btn"
			type="submit"
			disabled={submitting}
			bind:this={submitButton}
		>
			Submit
		</button>
	{/if}
</form>

{#if $gameStore?.length > 0}
	<div class="games">
		<h1>Games Found:</h1>
		<div class="games-list">
			{#each $gameStore as game (game.id)}
				<Game
					on:handleRemoveWishlist={handleRemoveWishlist}
					on:handleRemoveCollection={handleRemoveCollection}
					{game}
				/>
			{/each}
		</div>
		{#if showPagination}
			<Pagination
				{pageSize}
				{page}
				{totalItems}
				forwardText="Next"
				backwardText="Prev"
				pageSizes={[10, 25, 50, 100]}
				on:nextPageEvent={handleNextPageEvent}
				on:previousPageEvent={handlePreviousPageEvent}
				on:perPageEvent={handlePerPageEvent}
			/>
		{/if}
	</div>
{:else if $boredState.loading}
	<div class="games">
		<h1>Games Found:</h1>
		<div class="games-list">
			{#each placeholderList as game, i}
				<SkeletonPlaceholder
					style="width: 100%; height: 500px; border-radius: var(--borderRadius);"
				/>
			{/each}
		</div>
	</div>
{/if}

<style lang="postcss">
	.search {
		display: grid;
		gap: 1rem;
	}

	:global(.disclosure-button) {
		display: flex;
		gap: 0.25rem;
		place-items: center;
	}

	button {
		padding: 1rem;
		margin: 1.5rem 0;
	}

	label {
		display: grid;
		grid-template-columns: auto auto;
		gap: 1rem;
		place-content: start;
		place-items: center;

		@media (max-width: 850px) {
			display: flex;
			flex-wrap: wrap;
		}
	}

	.games {
		margin: 2rem 0rem;

		h1 {
			margin-bottom: 2rem;
		}
	}

	.games-list {
		display: grid;
		--listColumns: 4;
		grid-template-columns: repeat(var(--listColumns), minmax(200px, 1fr));
		gap: 2rem;

		@media screen and (800px < width <= 1200px) {
			--listColumns: 3;
		}

		@media screen and (650px < width <= 800px) {
			--listColumns: 2;
		}

		@media screen and (width <= 650px) {
			--listColumns: 1;
		}
	}
</style>
