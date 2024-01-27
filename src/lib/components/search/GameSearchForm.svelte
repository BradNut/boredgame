<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
  import { search_schema, type SearchSchema } from '$lib/zodValidation';
	import * as Form from "$lib/components/ui/form";

	export let form: SuperValidated<SearchSchema>;
</script>

<search>
	<Form.Root id="search-form" action="/search" method="GET" data-sveltekit-reload {form} schema={search_schema} let:config>
		<fieldset>
			<Form.Item>
				<Form.Field {config} name="q">
					<Form.Label for="label">Search</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Field>
				<Form.Field {config} name="skip">
					<Form.Input type="hidden" />
				</Form.Field>
				<Form.Field {config} name="limit">
					<Form.Input type="hidden" />
				</Form.Field>
			</Form.Item>
		</fieldset>
		<fieldset>
			<div class="flex items-center space-x-2">
				<Form.Field {config} name="exact">
					<Form.Label>Exact Search</Form.Label>
					<Form.Checkbox class="mt-0" />
				</Form.Field>
			</div>
		</fieldset>
		<Form.Button>Submit</Form.Button>
	</Form.Root>
</search>

<style lang="postcss">
</style>
