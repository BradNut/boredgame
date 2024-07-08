<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { AlertCircle } from "lucide-svelte";
	import { signInSchema, totpSchema } from '$lib/validations/auth';
	import * as Form from '$lib/components/ui/form';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import * as Alert from "$components/ui/alert";
	import { boredState } from '$lib/stores/boredState.js';
	import PinInput from '$components/pin-input.svelte';

	const { data } = $props();

	const superTotpForm = superForm(data.form, {
		onSubmit: () => boredState.update((n) => ({ ...n, loading: true })),
		onResult: () => boredState.update((n) => ({ ...n, loading: false })),
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

	let showRecoveryCode = $state(false);

	const { form: totpForm, enhance } = superTotpForm;
</script>

<svelte:head>
	<title>Bored Game | Login</title>
</svelte:head>

<div class="login">
	<form method="POST" use:enhance>
		<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			Please enter your {showRecoveryCode ? 'recovery code' : 'TOTP code'}
		</h2>
		<Form.Field form={superTotpForm} name="totpToken">
			<Form.Control let:attrs>
				{#if showRecoveryCode}
					<Form.Label for="totpToken">Recovery Code</Form.Label>
					<Input {...attrs} autocomplete="one-time-code" bind:value={$totpForm.totpToken} />
				{:else}
					<Form.Label for="totpToken">TOTP Code</Form.Label>
					<PinInput class="justify-evenly" {...attrs} bind:value={$totpForm.totpToken} />
				{/if}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
	{#if !showRecoveryCode}
		<Button variant="link" class="text-secondary-foreground" on:click={() => showRecoveryCode = true}>Show Recovery Code</Button>
	{:else}
		<Button variant="link" class="text-secondary-foreground" on:click={() => showRecoveryCode = false}>Show TOTP Code</Button>
	{/if}
</div>

<style lang="postcss">
	.loading {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 101;
		display: grid;
		place-items: center;
		gap: 1rem;

		h3 {
			color: white;
		}
	}
	.login {
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