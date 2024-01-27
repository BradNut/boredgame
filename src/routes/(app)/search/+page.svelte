<script lang="ts">
	import { dev } from '$app/environment';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { createPagination, createToolbar, melt } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight, LayoutList, LayoutGrid, Check } from 'lucide-svelte';
	import { search_schema, type SearchSchema } from '$lib/zodValidation';
	import Game from '$components/Game.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from "$lib/components/ui/form";
	import GameSearchForm from '$components/search/GameSearchForm.svelte';

	export let data;

	const { games, totalCount } = data?.searchData;

	console.log('data found', data);
	console.log('found games', games);
	console.log('found totalCount', totalCount);

	let submitButton: HTMLElement;
	let pageSize: number = data.form.limit || 10;

	$: showPagination = totalCount > pageSize;

	const {
    elements: { root: toolbarRoot },
    builders: { createToolbarGroup },
  } = createToolbar();
  const {
    elements: { group: listStyleGroup, item: listStyleItem },
  } = createToolbarGroup();

	const {
		elements: { root: paginationRoot, pageTrigger, prevButton, nextButton },
		states: { pages, range }
	} = createPagination({
		count: totalCount,
		perPage: pageSize,
		defaultPage: 1,
		siblingCount: 1
	});

	const gameListStyle: 'grid' | 'list' = 'grid';
	function handleListStyle(event) {
		console.log(event, typeof event);
	}
</script>

<div class="game-search">
	{#if dev}
		<SuperDebug collapsible data={data.form} />
	{/if}

	<GameSearchForm form={data.form} />

	<section class="games">
		<div>
			<h1>Games Found:</h1>
			<div use:melt={$toolbarRoot}>
				<div use:melt={$listStyleGroup} class="search-toolbar">
					<button class="style-item" aria-label='list' use:melt={$listStyleItem('list')} on:m-click|preventDefault={(e) => handleListStyle(e)}>
						<LayoutList class="square-5" />
					</button>
					<button class="style-item" aria-label='grid' use:melt={$listStyleItem('grid')} on:m-click|preventDefault={(e) => handleListStyle(e)}>
						<LayoutGrid class="square-5" />
					</button>
				</div>
			</div>
		</div>
		<div class="games-list">
			{#if totalCount > 0}
				{#each games as game (game.id)}
					<Game {game} />
				{/each}
			{:else}
				<h2>Sorry no games found!</h2>
			{/if}
		</div>
		{#if showPagination}
			<nav use:melt={$paginationRoot}>
			<p class="text-center">Showing items {$range.start} - {$range.end}</p>
			<div class="buttons">
				<button use:melt={$prevButton}><ChevronLeft /></button>
				{#each $pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<span>...</span>
					{:else}
						<button use:melt={$pageTrigger(page)} on:m-click={() => console.log('test')}>{page.value}</button>
					{/if}
				{/each}
				<button use:melt={$nextButton} on:m-click|preventDefault={() => console.log('test')} on:m-keydown|preventDefault={() => console.log('test')}><ChevronRight /></button>
			</div>
		</nav>
		{/if}
	</section>
</div>

<style lang="postcss">
	nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .text-center {
    text-align: center;
  }

	#search-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

  button {
    display: grid;
    place-items: center;
    background-color: rgb(var(--color-white) / 1);
    color: rgb(var(--color-magnum-700) / 1);
    box-shadow: 0px 1px 2px 0px rgb(var(--color-black) / 0.05);

    font-size: 14px;
  }

  button:hover {
    opacity: 0.75;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  nav :global(button[data-selected]) {
    background-color: rgb(var(--color-magnum-900));
    color: rgb(var(--color-white));
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

		.list {
			--listColumns: 1;
		}

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

	.search-toolbar {
		display: flex;
		place-items: center;
		gap: 0.15rem;
	}

	.style-item {
		padding: 0.1rem;
		border-radius: 0.375rem;
		border: 1px solid black;

		&:hover {
			opacity: 0.75;
		}

		&[data-state='on'] {
			background-color: grey;
		}
	}
</style>