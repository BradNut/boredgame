<script lang="ts">
	import { dev } from '$app/environment';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { createToolbar, melt } from '@melt-ui/svelte';
	import { LayoutList, LayoutGrid } from 'lucide-svelte';
	import Game from '$components/Game.svelte';
	import * as Pagination from "$lib/components/ui/pagination";
	import GameSearchForm from '$components/search/GameSearchForm.svelte';

	export let data;

	const { games, totalCount } = data?.searchData;

	console.log('data found', data);
	console.log('found games', games);
	console.log('found totalCount', totalCount);

	let pageSize: number = data.form.limit || 10;

	const {
    elements: { root: toolbarRoot },
    builders: { createToolbarGroup },
  } = createToolbar();
  const {
    elements: { group: listStyleGroup, item: listStyleItem },
  } = createToolbarGroup();

	const gameListStyle: 'grid' | 'list' = 'grid';
	function handleListStyle(event) {
		console.log(event, typeof event);
	}
</script>

<div class="game-search">
	{#if dev}
		<SuperDebug collapsible data={data.form} />
	{/if}

	<GameSearchForm data={data.form} />

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
		<Pagination.Root count={totalCount} perPage={pageSize} let:pages let:currentPage>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item isVisible={currentPage == page.value}>
							<Pagination.Link {page} isActive={currentPage == page.value}>
            		{page.value}
          		</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
      		<Pagination.NextButton />
    		</Pagination.Item>
  		</Pagination.Content>
		</Pagination.Root>
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