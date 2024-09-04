<script lang="ts">
import { Checkbox } from '$lib/components/ui/checkbox/index.js'
import * as Form from '$lib/components/ui/form'
import { Input } from '$lib/components/ui/input'
import { type AddRoleSchema, addRoleSchema } from '$lib/validations/account'
import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
import { zodClient } from 'sveltekit-superforms/adapters'

export let availableRoles: { name: string; cuid: string }[] = []
const data: SuperValidated<Infer<AddRoleSchema>> = availableRoles

const form = superForm(data, {
	validators: zodClient(addRoleSchema),
	// onUpdated: ({ form: f }) => {
	// 	if (f.valid) {
	// 		toast.success("You submitted" + JSON.stringify(f.data, null, 2));
	// 	} else {
	// 		toast.error("Please fix the errors in the form.");
	// 	}
	// }
})

const { form: formData, enhance } = form

function addRole(id: string) {
	$formData.roles = [...$formData.roles, id]
}

function removeRole(id: string) {
	$formData.roles = $formData.roles.filter((i) => i !== id)
}
</script>

<form action="/?/addMultipleRoles" method="POST" use:enhance>
	<Form.Fieldset {form} name="roles" class="space-y-0">
		<div class="mb-4">
			<Form.Legend class="text-base">Roles</Form.Legend>
			<Form.Description>
				Select the rolesTable you want to add to the user.
			</Form.Description>
		</div>
		<div class="space-y-2">
			{#each roles as item}
				{@const checked = $formData.roles.includes(item.cuid)}
				<div class="flex flex-row items-start space-x-3">
					<Form.Control let:attrs>
						<Checkbox
								{...attrs}
								{checked}
								onCheckedChange={(v) => {
									if (v) {
										addItem(item.id);
									} else {
										removeItem(item.id);
									}
								}}
						/>
						<Form.Label class="text-sm font-normal">
							{item.label}
						</Form.Label>
						<input
								hidden
								type="checkbox"
								name={attrs.name}
								value={item.id}
								{checked}
						/>
					</Form.Control>
				</div>
			{/each}
			<Form.FieldErrors />
		</div>
	</Form.Fieldset>
	<Form.Button>Update display</Form.Button>
	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>