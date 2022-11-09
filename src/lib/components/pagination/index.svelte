<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions
	} from '@rgossiaux/svelte-headlessui';
	import {
		CheckIcon,
		ChevronLeftIcon,
		ChevronRightIcon
	} from '@rgossiaux/svelte-heroicons/outline';
	import { boredState } from '$root/lib/stores/boredState';

	const dispatch = createEventDispatcher();
	// export let pageSize = 10;
	export let pageSize: number; // Reactive, bind
	export let page: number = 1; // Reactive, bind
	export let totalItems: number;
	export let pageSizeInputDisabled: boolean = false;
	export let pageSizes: ReadonlyArray<Number> = [10];
	export let forwardText: string;
	export let backwardText: string;
	export let disabled: boolean = false;

	afterUpdate(() => {
		if (page > totalPages) {
			page = totalPages;
		}
	});

	console.log('Pagination info');
	console.log({ pageSize, page, totalItems });

	$: totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
	$: backButtonDisabled = disabled || page === 1;
	$: forwardButtonDisabled = disabled || page === totalPages;
	$: itemsLeft = totalItems - page * pageSize >= 0 ? totalItems - page * pageSize : 0;
	console.log('totalPages', totalPages);
	const prevPage: number = page - 1;
	const nextPage: number = page + 1;
</script>

<div class="container">
	<div class="listbox">
		<p>Per-page:</p>
		<Listbox
			class="list-box"
			value={$boredState?.search?.pageSize || 10}
			on:change={(e) => {
				dispatch('update', { pageSize: e.detail, page });
			}}
			let:open
		>
			<ListboxButton>{pageSize || 10}</ListboxButton>
			{#if open}
				<div transition:fade={{ duration: 100 }}>
					<ListboxOptions static class="options">
						{#each pageSizes as size (size)}
							<ListboxOption
								value={size}
								disabled={pageSizeInputDisabled}
								class={({ active }) => (active ? 'active option' : 'option')}
								style="display: flex; gap: 1rem; padding: 1rem;"
								let:selected
							>
								{#if selected}
									<CheckIcon height="24" width="24" />
								{/if}
								<span class="size-option" class:selected>{size.toString()}</span>
							</ListboxOption>
						{/each}
					</ListboxOptions>
				</div>
			{/if}
		</Listbox>
	</div>
	<p>
		Page {page || 1} of {totalPages || 1}
	</p>
	<p>
		{itemsLeft} Item{itemsLeft > 1 || itemsLeft === 0 ? 's' : ''} Left
	</p>
	<div style="display: flex; gap: 2rem;">
		<button
			type="button"
			class="btn"
			disabled={backButtonDisabled}
			on:click={() => {
				page--;
				dispatch('previousPageEvent', { page });
			}}
		>
			<ChevronLeftIcon width="24" height="24" />
			<p class="word">{backwardText || 'Prev'}</p>
		</button>
		<button
			type="button"
			class="btn"
			disabled={forwardButtonDisabled}
			on:click={() => {
				page++;
				dispatch('nextPageEvent', { page });
			}}
		>
			<p class="word">{forwardText || 'Next'}</p>
			<ChevronRightIcon width="24" height="24" />
		</button>
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		align-items: center;
		gap: 1rem;
		margin: 3rem 0;

		@media (max-width: 640px) {
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
		}

		.btn {
			display: flex;
			gap: 0.5rem;
			padding: 1rem;
		}
	}

	@media (max-width: 800px) {
		.word {
			display: none;
		}
	}

	/* .list-container :global(.list-box) {
		height: 100%;
		position: relative;
	}

	.list-container :global(.list-options) {
		position: absolute;
	}

	.list-container :global(.active) {
		display: flex;
		gap: 1rem;
		padding: 1rem;
	} */

	button {
		/* min-width: 50px; */
		&[aria-current],
		&.current {
			color: black; // TODO: Fix these colors
			background: white;
		}
		&[disabled] {
			pointer-events: none;
			color: var(--lightGrey);
			text-decoration: line-through;
		}
	}

	.listbox {
		--width: 100px;
		margin: 0.5rem;
	}

	.listbox :global(.active) {
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	.listbox :global(.button) {
		width: var(--width);
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-16) var(--spacing-24);
		font-weight: 700;
		background-color: var(--clr-primary);
		color: var(--clr-theme-txt);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-sm);
	}
	.listbox :global(.arrows) {
		width: 20px;
		height: 20px;
		display: block;
	}
	.listbox :global(.options) {
		width: var(--width);
		position: absolute;
		margin-top: 0.4rem;
		font-weight: 700;
		color: var(--clr-theme-txt);
		background-color: var(--clr-primary);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-sm);
		list-style: none;
	}
	.listbox :global(.option) {
		display: block;
		padding: var(--spacing-16) var(--spacing-24);
		border-radius: var(--rounded-20);
		cursor: pointer;
	}
	.listbox :global(.active) {
		background-color: var(--clr-theme-active);
	}
</style>
