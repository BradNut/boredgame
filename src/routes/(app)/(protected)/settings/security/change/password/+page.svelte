<script lang="ts">
import * as Alert from '$components/ui/alert'
import * as Form from '$components/ui/form'
import { Input } from '$components/ui/input'
import { Toggle } from '$components/ui/toggle'
import { AlertTriangle, EyeIcon, EyeOff } from 'lucide-svelte'
import { zodClient } from 'sveltekit-superforms/adapters'
import { superForm } from 'sveltekit-superforms/client'
import { changeUserPasswordSchema } from './schemas'

const { data } = $props()

const form = superForm(data.form, {
	taintedMessage: null,
	validators: zodClient(changeUserPasswordSchema),
	delayMs: 500,
	multipleSubmits: 'prevent',
})

let hiddenCurrentPassword = $state(true)
let hiddenPassword = $state(true)
let hiddenConfirmPassword = $state(true)

const { form: formData, enhance } = form
</script>

<form method="POST" use:enhance>
	<h3>Change Password</h3>
	<hr class="!border-t-2 mt-2 mb-6" />
	<Alert.Root variant="destructive" class="mb-4">
		<AlertTriangle class="h-4 w-4" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description>
			Changing your password will log you out of all devices.
		</Alert.Description>
	</Alert.Root>
	<Form.Field {form} name="current_password">
		<Form.Control let:attrs>
			<Form.Label for="current_password">Current Password</Form.Label>
			<span class="flex gap-1">
				<Input {...attrs} autocomplete="password" type={hiddenCurrentPassword ? 'password' : 'text'} bind:value={$formData.current_password} />
				<Toggle aria-label={`${hiddenCurrentPassword ? 'Show' : 'Hide' } Current Password}`} onPressedChange={() => hiddenCurrentPassword = !hiddenCurrentPassword}>{#if hiddenCurrentPassword}<EyeIcon />{:else}<EyeOff />{/if}</Toggle>
			</span>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label for="password">New Password</Form.Label>
			<span class="flex gap-1">
				<Input {...attrs} autocomplete="new-password" type={hiddenPassword ? 'password' : 'text'} bind:value={$formData.password} />
				<Toggle aria-label={`${hiddenPassword ? 'Show' : 'Hide' } Password}`} onPressedChange={() => hiddenPassword = !hiddenPassword}>{#if hiddenPassword}<EyeIcon />{:else}<EyeOff />{/if}</Toggle>
			</span>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="confirm_password">
		<Form.Control let:attrs>
			<Form.Label for="confirm_password">Confirm New Password</Form.Label>
			<span class="flex gap-1">
				<Input {...attrs} autocomplete="new-password" type={hiddenConfirmPassword ? 'password' : 'text'} bind:value={$formData.confirm_password} />
				<Toggle aria-label={`${hiddenConfirmPassword ? 'Show' : 'Hide' } Confirm Password}`} onPressedChange={() => hiddenConfirmPassword = !hiddenConfirmPassword}>{#if hiddenConfirmPassword}<EyeIcon />{:else}<EyeOff />{/if}</Toggle>
			</span>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>

<style lang="postcss">
	form {
		max-width: 20rem;
	}
</style>