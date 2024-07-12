<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { search_schema, type SearchSchema } from '$lib/zodValidation';
	import * as Form from "$lib/components/ui/form";
	import Input from '$components/ui/input/input.svelte';
	import Checkbox from '$components/ui/checkbox/checkbox.svelte';

	export let data: SuperValidated<Infer<SearchSchema>>;

	const form = superForm(data, {
		validators: zodClient(search_schema),
	});

	const { form: formData } = form;
</script>

<search>
	<form id="search-form" action="/search" method="GET" data-sveltekit-reload>
		<fieldset>
			<Form.Field {form} name="q">
				<Form.Control let:attrs>
					<Form.Label>Search</Form.Label>
					<Input {...attrs} bind:value={$formData.q} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="skip">
				<Form.Control let:attrs>
					<Input type="hidden" />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="limit">
				<Form.Control let:attrs>
					<Input type="hidden" />
				</Form.Control>
			</Form.Field>
		</fieldset>
		<fieldset>
			<div class="flex items-center space-x-2">
				<Form.Field {form} name="exact">
					<Form.Control let:attrs>
						<Form.Label>Exact Search</Form.Label>
						<Checkbox {...attrs} class="mt-0" bind:checked={$formData.exact} />
						<input name={attrs.name} value={$formData.exact} hidden />
					</Form.Control>
				</Form.Field>
			</div>
		</fieldset>
		<Form.Button>Submit</Form.Button>
	</form>
</search>

<style lang="postcss">
</style>
