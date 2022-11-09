<script lang="ts">
	import { tick } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';
	import { ChevronRightIcon } from '@rgossiaux/svelte-heroicons/solid';
	import { boredState } from '$lib/stores/boredState';
	import AdvancedSearch from '$lib/components/search/advancedSearch/index.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { gameStore } from '$root/lib/stores/gameSearchStore';
	import { toast } from '../../toast/toast';
	import Pagination from '$lib/components/pagination/index.svelte';
	import { ToastType } from '$root/lib/types';

	export let data: PageData;
	console.log('search page data', data);
	export let form: ActionData;
	console.log('search page form', form);

	export let showButton: boolean = false;
	export let advancedSearch: boolean = false;
	// export let form: ActionData;
	let submitButton: HTMLElement;
	let pageSize = 10;
	console.log('Form data page', +form?.data?.page);
	let page = +form?.data?.page || 1;
	$: skip = (page - 1) * pageSize;
	console.log({ skip });
	let totalItems = form?.totalCount || data?.totalCount || 0;
	console.log({ pageSize });
	console.log({ page });
	console.log({ totalItems });
	$: console.log('submit button', submitButton);

	let submitting = $boredState?.loading;
	let name = form?.name || '';
	let disclosureOpen = false;
	if (form?.error) {
		disclosureOpen = true;
	}

	async function handleNextPageEvent(event: CustomEvent) {
		console.log('Next page called', event.detail);
		console.log('Current page: ', page);
		if (+event?.detail?.page === page + 1) {
			console.log('Page equals plus one');
			page += 1;
		}
		// skip = (page - 1) * pageSize;
		await tick();
		console.log('New Page Value', page);
		console.log('New Skip value', skip);
		console.log('New skip value DOM: ', document.getElementById('skip')?.getAttribute('value'));
		submitButton.click();
	}

	async function handlePerPageEvent(event: CustomEvent) {
		console.log('Per Page Event called', event.detail);
		page = 1;
		pageSize = event.detail.pageSize;
		await tick();
		console.log('New limit value DOM: ', document.getElementById('limit')?.getAttribute('value'));
		submitButton.click();
	}
</script>

<form
	id="search-form"
	action="/search"
	method="post"
	use:enhance={({ data }) => {
		gameStore.removeAll();
		// data.append('limit', pageSize.toString());
		// data.append('skip', Math.floor(page * pageSize).toString());
		boredState.update((n) => ({ ...n, loading: true }));
		return async ({ result }) => {
			boredState.update((n) => ({ ...n, loading: false }));
			console.log(result);
			// `result` is an `ActionResult` object
			if (result.type === 'error') {
				toast.send('Error!', { duration: 3000, type: ToastType.ERROR, dismissible: true });
				await applyAction(result);
			} else if (result.type === 'success') {
				gameStore.removeAll();
				gameStore.addAll(result?.data?.games);
				// totalItems = result?.data?.totalCount;
				console.log(`Frontend result search enhance: ${JSON.stringify(result)}`);
				totalItems = result?.data?.totalCount;
				// skip = result?.data?.skip || 0;
				// page = skip / pageSize || 0;
				// console.log('enhance', page, skip, totalItems);
				toast.send('Sucess!', { duration: 3000, type: ToastType.INFO, dismissible: true });
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
	<!-- {#if showButton} -->
	<button
		id="search-submit"
		class="btn"
		type="submit"
		disabled={submitting}
		bind:this={submitButton}
	>
		Submit
	</button>
	<!-- {/if} -->
</form>

<Pagination
	{pageSize}
	{page}
	{totalItems}
	forwardText="Next"
	backwardText="Prev"
	pageSizes={[10, 25, 50, 100]}
	on:nextPageEvent={handleNextPageEvent}
	on:previousPageEvent={(event) => console.log('Prev page called', event)}
	on:perPageEvent={handlePerPageEvent}
/>

<style lang="scss">
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
</style>
