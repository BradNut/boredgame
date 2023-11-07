<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
  import type { SearchSchema } from '$lib/zodValidation';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	export let data;
	console.log("text search data", data);
	export let showButton: boolean = false;
	export let advancedSearch: boolean = false;

	const { form, errors }: SuperValidated<SearchSchema> = superForm(data.form);

	const dev = process.env.NODE_ENV !== 'production';

	// TODO: Keep all Pagination Values on back and forth browser
	// TODO: Add cache for certain number of pages so back and forth doesn't request data again
</script>

{#if dev}
	<SuperDebug collapsible data={$form} />
{/if}

<search>
	<form id="search-form" action="/search" method="GET">
		<div class="search">
			<fieldset class="text-search">
				<Label for="label">Search</Label>
				<Input type="text" id="q" class={$errors.q && "outline outline-destructive"} name="q" placeholder="Search board games" data-invalid={$errors.q} bind:value={$form.q} />
				{#if $errors.q}
					<p class="text-sm text-destructive">{$errors.q}</p>
				{/if}
				<input id="skip" type="hidden" name="skip" bind:value={$form.skip} />
				<input id="limit" type="hidden" name="limit" bind:value={$form.limit} />
			</fieldset>
		</div>
		{#if showButton}
			<Button type="submit">Submit</Button>
		{/if}
	</form>
</search>

<style lang="postcss">
	:global(.disclosure-button) {
		display: flex;
		gap: 0.25rem;
		place-items: center;
	}

	#search-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
