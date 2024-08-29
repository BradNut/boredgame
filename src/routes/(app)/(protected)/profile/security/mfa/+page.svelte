<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { AlertTriangle } from 'lucide-svelte';
	import * as Alert from '$components/ui/alert';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { addTwoFactorSchema, removeTwoFactorSchema } from '$lib/validations/account';
	import PinInput from '$components/pin-input.svelte';

	export let data;

	const { qrCode, twoFactorEnabled, recoveryCodes } = data;

	const addTwoFactorForm = superForm(data.addTwoFactorForm, {
		taintedMessage: null,
		validators: zodClient(addTwoFactorSchema),
		delayMs: 500,
		multipleSubmits: 'prevent',
	});

	const removeTwoFactorForm = superForm(data.removeTwoFactorForm, {
		taintedMessage: null,
		validators: zodClient(removeTwoFactorSchema),
		delayMs: 500,
		multipleSubmits: 'prevent',
	});

	console.log('Two Factor: ', twoFactorEnabled, recoveryCodes);

	const { form: addTwoFactorFormData, enhance: addTwoFactorEnhance } = addTwoFactorForm;
	const { form: removeTwoFactorFormData, enhance: removeTwoFactorEnhance } = removeTwoFactorForm;
</script>

<h1>Two-Factor Authentication</h1>

{#if twoFactorEnabled}
	<h2>Currently you have two factor authentication <span class="text-green-500">enabled</span></h2>
	<p>To disable two factor authentication, please enter your current password.</p>
	<form method="POST" action="?/disableTotp" use:removeTwoFactorEnhance data-sveltekit-replacestate>
		<Form.Field form={removeTwoFactorForm} name="current_password">
			<Form.Control let:attrs>
				<Form.Label for="password">Current Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$removeTwoFactorFormData.current_password} />
			</Form.Control>
			<Form.Description>Please enter your current password.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Disable Two Factor Authentication</Form.Button>
	</form>
{:else}
	<h2>Please scan the following QR Code</h2>
	<img src={qrCode} alt="QR Code" />
	<form method="POST" action="?/enableTotp" use:addTwoFactorEnhance data-sveltekit-replacestate>
		<Form.Field form={addTwoFactorForm} name="two_factor_code">
			<Form.Control let:attrs>
				<Form.Label for="code">Enter Code</Form.Label>
				<PinInput {...attrs} bind:value={$addTwoFactorFormData.two_factor_code} />
			</Form.Control>
			<Form.Description>This is the code from your authenticator app.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={addTwoFactorForm} name="current_password">
			<Form.Control let:attrs>
				<Form.Label for="password">Enter Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$addTwoFactorFormData.current_password} />
			</Form.Control>
			<Form.Description>Please enter your current password.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
{/if}