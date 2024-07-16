<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { AlertCircle } from "lucide-svelte";
	import { signInSchema } from '$lib/validations/auth';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
  import * as Alert from "$components/ui/alert";
	import { boredState } from '$lib/stores/boredState.js';

	let { data } = $props();

	const superLoginForm = superForm(data.form, {
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
		// validators: zodClient(signInSchema),
		// validationMethod: 'oninput',
		delayMs: 0,
	});

	const { form: loginForm, enhance } = superLoginForm;
</script>

<svelte:head>
	<title>Bored Game | Login</title>
</svelte:head>

<Card.Root class="mx-auto mt-24 max-w-sm">
	<Card.Header>
		Log into your account
	</Card.Header>
	<Card.Content>
		{@render usernamePasswordForm()}
		<p class="px-8 py-4 text-center text-sm text-muted-foreground">
			By clicking continue, you agree to our
			<a href="/terms" class="underline underline-offset-4 hover:text-primary">
				Terms of Use
			</a>
			and
			<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
				Privacy Policy
			</a>.
		</p>
	</Card.Content>
</Card.Root>

{#snippet usernamePasswordForm()}
	<form method="POST" use:enhance>
		<Form.Field form={superLoginForm} name="username">
			<Form.Control let:attrs>
				<Form.Label for="username">Username/Email</Form.Label>
				<Input {...attrs} autocomplete="username" bind:value={$loginForm.username} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={superLoginForm} name="password">
			<Form.Control let:attrs>
				<Form.Label for="password">Password</Form.Label>
				<Input {...attrs} autocomplete="current-password" type="password" bind:value={$loginForm.password} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex align-center justify-between">
			<Form.Button>Login</Form.Button>
			<Button variant="link" class="text-secondary-foreground" href="/password/reset">Forgot Password?</Button>
		</div>
	</form>
{/snippet}

<style lang="postcss">
	.login {
		display: flex;
		gap: 1rem;
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