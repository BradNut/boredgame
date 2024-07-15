<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { AlertCircle } from "lucide-svelte";
	import { recoveryCodeSchema, totpSchema } from '$lib/validations/auth';
	import * as Form from '$lib/components/ui/form';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import * as Alert from "$components/ui/alert";
	import PinInput from '$components/pin-input.svelte';

	const { data } = $props();

	const superTotpForm = superForm(data.totpForm, {
		flashMessage: {
			module: flashModule,
			onError: ({ result, flashMessage }) => {
				// Error handling for the flash message:
				// - result is the ActionResult
				// - message is the flash store (not the status message store)
				const errorMessage = result.error.message
				flashMessage.set({ type: 'error', message: errorMessage });
			}
		},
		syncFlashMessage: false,
		taintedMessage: null,
		validators: zodClient(totpSchema),
		validationMethod: 'oninput',
		delayMs: 0,
	});

	const superRecoveryCodeForm = superForm(data.recoveryCodeForm, {
		validators: zodClient(recoveryCodeSchema),
		resetForm: false,
		flashMessage: {
			module: flashModule,
			onError: ({ result, flashMessage }) => {
				// Error handling for the flash message:
				// - result is the ActionResult
				// - message is the flash store (not the status message store)
				const errorMessage = result.error.message
				flashMessage.set({ type: 'error', message: errorMessage });
			}
		},
		syncFlashMessage: false,
		taintedMessage: null,
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

<div class="totp">
	<h2
			class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Please enter your {showRecoveryCode ? 'recovery code' : 'TOTP code'}
	</h2>
	{#if !showRecoveryCode}
		{@render totpForm()}
		<Button variant="link" class="text-secondary-foreground" on:click={() => showRecoveryCode = true}>Show Recovery Code</Button>
	{:else}
		{@render recoveryCodeForm()}
		<Button variant="link" class="text-secondary-foreground" on:click={() => showRecoveryCode = false}>Show TOTP Code</Button>
	{/if}
</div>

{#snippet totpForm()}
	<form method="POST" use:totpEnhance>
		<Form.Field form={totpFormData} name="totpToken">
			<Form.Control let:attrs>
				<Form.Label for="totpToken">TOTP Code</Form.Label>
				<PinInput {...attrs} bind:value={$totpFormData.totpToken} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
{/snippet}

{#snippet recoveryCodeForm()}
	<form method="POST" use:recoveryCodeEnhance>
		<Form.Field form={recoveryCodeFormData} name="recoveryCode">
			<Form.Control let:attrs>
				<Form.Label for="totpToken">Recovery Code</Form.Label>
				<PinInput {...attrs} bind:value={$recoveryCodeFormData.recoveryCode} inputCount={10} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
{/snippet}

<style lang="postcss">
	.totp {
		display: flex;
		margin-top: 1.5rem;
		flex-direction: column;
		justify-content: center;
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