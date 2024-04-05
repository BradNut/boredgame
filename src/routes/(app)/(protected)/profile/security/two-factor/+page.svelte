<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { AlertTriangle } from 'lucide-svelte';
	import * as Alert from '$components/ui/alert';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { addTwoFactorSchema } from '$lib/validations/account';

	export let data;

	const { qrCode, twoFactorEnabled, recoveryCodes } = data;

	const form = superForm(data.form, {
		taintedMessage: null,
		validators: zodClient(addTwoFactorSchema),
		delayMs: 500,
		multipleSubmits: 'prevent',
	});

	const { form: formData, enhance } = form;
</script>

<h1>Two-Factor Authentication</h1>

{#if twoFactorEnabled}
	<h2>Two-Factor Authentication is <span class="text-green-500">enabled</span></h2>
	{#if recoveryCodes.length > 0}
		Please copy the recovery codes below as they will not be shown again.
		{#each recoveryCodes as code}
			<p>{code}</p>
		{/each}
	{/if}
{:else}
	<h2>Please scan the following QR Code</h2>
	<img src={qrCode} alt="QR Code" />
	<form method="POST" use:enhance>
		<Form.Field {form} name="two_factor_code">
			<Form.Control let:attrs>
				<Form.Label for="code">Enter Code</Form.Label>
				<Input {...attrs} bind:value={$formData.two_factor_code} />
			</Form.Control>
			<Form.Description>This is the code from your authenticator app.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="current_password">
			<Form.Control let:attrs>
				<Form.Label for="password">Enter Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$formData.current_password} />
			</Form.Control>
			<Form.Description>Please enter your current password.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
{/if}