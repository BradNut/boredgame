<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { AlertCircle } from "lucide-svelte";
	import { recoveryCodeSchema, totpSchema } from '$lib/validations/auth';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Form from '$lib/components/ui/form';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import * as Alert from "$components/ui/alert";
	import PinInput from '$components/pin-input.svelte';

	const { data } = $props();

	const superTotpForm = superForm(data.totpForm, {
		resetForm: false,
		validators: zodClient(totpSchema),
	});

	const superRecoveryCodeForm = superForm(data.recoveryCodeForm, {
		validators: zodClient(recoveryCodeSchema),
		resetForm: false,
		validationMethod: 'oninput',
		delayMs: 0,
	});

	let showRecoveryCode = $state(false);

	const { form: totpFormData, enhance: totpEnhance } = superTotpForm;
	const { form: recoveryCodeFormData, enhance: recoveryCodeEnhance } = superRecoveryCodeForm;
</script>

<svelte:head>
	<title>Bored Game | Login</title>
</svelte:head>

<Card.Root class="mx-auto mt-24 max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Two Factor Authentication</Card.Title>
		<Card.Description>Please enter your {showRecoveryCode ? 'recovery code' : 'TOTP code'}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if !showRecoveryCode}
			{@render totpForm()}
			<Button variant="link" class="text-secondary-foreground" on:click={() => showRecoveryCode = true}>Show Recovery Code</Button>
		{:else}
			{@render recoveryCodeForm()}
			<Button variant="link" class="text-secondary-foreground" on:click={() => showRecoveryCode = false}>Show TOTP Code</Button>
		{/if}
	</Card.Content>
</Card.Root>

{#snippet totpForm()}
	<form method="POST" action="?/validateTotp" use:totpEnhance>
		<Form.Field class="form-field-container" form={superTotpForm} name="totpToken">
			<Form.Control let:attrs>
				<Form.Label>TOTP Code</Form.Label>
				<PinInput {...attrs} bind:value={$totpFormData.totpToken} class="justify-evenly" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button class="w-full">Submit</Form.Button>
	</form>
{/snippet}

{#snippet recoveryCodeForm()}
	<form method="POST" action="?/validateRecoveryCode" use:recoveryCodeEnhance>
		<Form.Field form={superRecoveryCodeForm} name="recoveryCode">
			<Form.Control let:attrs>
				<Form.Label>Recovery Code</Form.Label>
				<Input {...attrs} bind:value={$recoveryCodeFormData.recoveryCode} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button class="w-full">Submit</Form.Button>
	</form>
{/snippet}

<style lang="postcss">
	.totp {
		display: flex;
		margin-top: 1.5rem;
		flex-direction: column;
		width: 100%;
		margin-right: auto;
		margin-left: auto;

		@media (min-width: 640px) {
			width: 350px;
		}

		form {
			display: grid;
			gap: 0.5rem;
			align-items: center;
			max-width: 24rem;
		}
	}
</style>