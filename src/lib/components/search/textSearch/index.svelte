<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { SuperValidated } from 'sveltekit-superforms/index';
	import { boredState } from '$lib/stores/boredState';
	import AdvancedSearch from '$lib/components/search/advancedSearch/index.svelte';
	import { xl, md, sm } from '$lib/stores/mediaQueryStore';
	import { gameStore } from '$lib/stores/gameSearchStore';
	import Pagination from '$lib/components/pagination/index.svelte';
	import Game from '$lib/components/game/index.svelte';
	import { type GameType, type SavedGameType } from '$lib/types';
  import type { SearchSchema } from '$lib/zodValidation';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';

	export let data;
	console.log("text search data", data);
	export let showButton: boolean = false;
	export let advancedSearch: boolean = false;

	const { games, totalCount } = data?.searchData;
	const { form, errors, enhance, constraints, message }: SuperValidated<SearchSchema> = superForm(data.form);

	let gameToRemove: GameType | SavedGameType;
	let numberOfGameSkeleton = 1;
	let submitButton: HTMLElement;
	let pageSize = +form?.limit || 10;
	let totalItems = +form?.searchData?.totalCount || 0;
	let offset = +form?.skip || 0;
	let page = Math.floor(offset / pageSize) + 1 || 1;
	let submitting = $boredState?.loading;
	let name = form?.name || '';
	let disclosureOpen = $errors.length > 0 || false;

	$: showPagination = totalCount > pageSize;

	if ($xl) {
		numberOfGameSkeleton = 8;
	} else if ($md) {
		numberOfGameSkeleton = 3;
	} else if ($sm) {
		numberOfGameSkeleton = 2;
	} else {
		numberOfGameSkeleton = 1;
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
		page = 1;
		pageSize = event.detail.pageSize;
		await tick();
		submitButton.click();
	}

	const dev = process.env.NODE_ENV !== 'production';

	// TODO: Keep all Pagination Values on back and forth browser
	// TODO: Add cache for certain number of pages so back and forth doesn't request data again
</script>

{#if dev}
	<SuperDebug data={$form} />
{/if}

<form id="search-form" action="/search" method="GET" use:enhance>
	<div class="search">
		<fieldset class="text-search" aria-busy={submitting} disabled={submitting}>
			<Label for="label">Search</Label>
			<Input type="text" id="q" class={$errors.q && "outline outline-destructive"} name="search" placeholder="Search board games" data-invalid={$errors.q} bind:value={$form.q} />
			{#if $errors.q}
				<p class="text-sm text-destructive">{$errors.q}</p>
			{/if}
			<input id="skip" type="hidden" name="skip" bind:value={$form.skip} />
			<input id="limit" type="hidden" name="limit" bind:value={$form.limit} />
		</fieldset>
		{#if advancedSearch}
			<!-- <Disclosure> -->
				<!-- <DisclosureButton
					class="disclosure-button"
					on:click={() => (disclosureOpen = !disclosureOpen)}
				> -->
					<span>Advanced Search?</span>
					<!-- <ChevronRightIcon
						class="icon disclosure-icon"
						style={disclosureOpen
							? 'transform: rotate(90deg); transition: transform 0.5s ease;'
							: 'transform: rotate(0deg); transition: transform 0.5s ease;'}
					/> -->
				<!-- </DisclosureButton> -->

				{#if disclosureOpen}
					<div transition:fade|global>
						<!-- Using `static`, `DisclosurePanel` is always rendered,
                and ignores the `open` state -->
						<!-- <DisclosurePanel static> -->
							{#if disclosureOpen}
								<AdvancedSearch {form} {errors} {constraints} />
							{/if}
						<!-- </DisclosurePanel> -->
					</div>
				{/if}
			<!-- </Disclosure> -->
		{/if}
	</div>
	{#if showButton}
		<Button type="submit">Submit</Button>
	{/if}
</form>

{#if $boredState.loading}
	<div class="games">
		<h1>Games Found:</h1>
		<div class="games-list">
			<!-- {#each placeholderList as game, i}
				<SkeletonPlaceholder
					style="width: 100%; height: 500px; border-radius: var(--borderRadius);"
				/>
			{/each} -->
		</div>
	</div>
{:else}
	<div class="games">
		<h1>Games Found:</h1>
		<div class="games-list">
			{#if totalCount > 0}
				{#each games as game (game.id)}
					<Game {game} />
				{/each}
			{:else}
			 <h2>Sorry no games found!</h2>
			{/if}
		</div>
		{#if showPagination && $gameStore?.length > 0}
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

		& h1 {
			margin-bottom: 2rem;
		}
	}

	.games-list {
		display: grid;
		--listColumns: 4;
		grid-template-columns: repeat(var(--listColumns), minmax(250px, 1fr));
		gap: 2rem;

		@media (width >= 1500px) {
			--listColumns: 3;
		}

		@media (1000px < width <= 1500px) {
			--listColumns: 3;
		}

		@media (600px < width <= 1000px) {
			--listColumns: 2;
		}

		@media (width <= 600px) {
			--listColumns: 1;
		}
	}
</style>
