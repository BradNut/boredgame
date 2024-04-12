<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { AlertTriangle } from 'lucide-svelte';
	import * as Alert from "$components/ui/alert";
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { changeUserPasswordSchema } from '$lib/validations/account';

	export let data;

	const form = superForm(data.form, {
		taintedMessage: null,
		validators: zodClient(changeUserPasswordSchema),
		delayMs: 500,
		multipleSubmits: 'prevent'
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<h3>Change Password</h3>
	<hr class="!border-t-2 mt-2 mb-6" />
	<Alert.Root variant="destructive">
		<AlertTriangle class="h-4 w-4" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description>
			Changing your password will log you out of all devices.
		</Alert.Description>
	</Alert.Root>
	<Form.Field {form} name="current_password">
		<Form.Control let:attrs>
			<Form.Label for="current_password">Current Password</Form.Label>
			<Input {...attrs} bind:value={$formData.current_password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label for="password">New Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="confirm_password">
		<Form.Control let:attrs>
			<Form.Label for="confirm_password">Confirm New Password</Form.Label>
			<Input {...attrs} bind:value={$formData.confirm_password} />
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