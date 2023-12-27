<script lang="ts">
	import { dev } from '$app/environment';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { createPagination, melt } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import type { SearchSchema } from '$lib/zodValidation';
	import Game from '$lib/components/game/index.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from "$lib/components/ui/checkbox";

	export let data;

	const { form, errors }: SuperValidated<SearchSchema> = superForm(data.form);
	const { games, totalCount } = data?.searchData;

	let submitButton: HTMLElement;
	let pageSize = +form?.limit || 10;

	$: showPagination = totalCount > pageSize;

	const {
		elements: { root, pageTrigger, prevButton, nextButton },
		states: { pages, range }
	} = createPagination({
		count: totalCount,
		perPage: pageSize,
		defaultPage: 1,
		siblingCount: 1
	});
</script>

<div class="game-search">
	{#if dev}
		<SuperDebug collapsible data={$form} />
	{/if}

	<search>
		<form id="search-form" action="/search" method="GET">
			<fieldset>
				<Label for="label">Search</Label>
				<Input type="text" id="q" class={$errors.q && "outline outline-destructive"} name="q" placeholder="Search board games" data-invalid={$errors.q} bind:value={$form.q} />
				{#if $errors.q}
					<p class="text-sm text-destructive">{$errors.q}</p>
				{/if}
				<input id="skip" type="hidden" name="skip" bind:value={$form.skip} />
				<input id="limit" type="hidden" name="limit" bind:value={$form.limit} />
			</fieldset>
			<fieldset class="flex items-center space-x-2">
				<Checkbox id="exact" bind:checked={$form.exact} aria-labelledby="exact-label" />
				<Label
					id="exact-label"
					for="exact"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Exact Search
				</Label>
			</fieldset>
			<Button type="submit">Submit</Button>
		</form>
	</search>

	<section class="games">
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
		{#if showPagination}
			<nav use:melt={$root}>
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
    border-radius: 2px;
    background-color: rgb(var(--color-white) / 1);
    color: rgb(var(--color-magnum-700) / 1);
    box-shadow: 0px 1px 2px 0px rgb(var(--color-black) / 0.05);

    font-size: 14px;

    padding-inline: 0.75rem;
    height: 2rem;
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