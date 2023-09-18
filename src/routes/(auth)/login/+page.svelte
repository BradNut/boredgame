<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import toast from 'svelte-french-toast';
	import { AlertCircle } from "lucide-svelte";
	import { signInSchema } from '$lib/config/zod-schemas.js';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
  import * as Alert from "$components/ui/alert";
	import { boredState } from '$lib/stores/boredState.js';

	export let data;
	const { form, errors, enhance } = superForm(data.form, {
		onSubmit: () => boredState.update((n) => ({ ...n, loading: true })),
  	onResult: () => boredState.update((n) => ({ ...n, loading: false })),
		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				// Error handling for the flash message:
				// - result is the ActionResult
				// - message is the flash store (not the status message store)
				const errorMessage = result.error.message
				message.set({ type: 'error', message: errorMessage });
			}
		},
		syncFlashMessage: false,
		taintedMessage: null,
		validators: signInSchema,
		validationMethod: 'oninput',
		delayMs: 0,
	});

	const flash = flashModule.getFlash(page);

	$: {
		if ($flash) {
			toast.error($flash.message, {
				duration: 5000
			});
		}
	}
</script>

<svelte:head>
	<title>Bored Game | Login</title>
</svelte:head>

<div class="login">
	<form method="POST" use:enhance>
		<h2
			class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			Log into your account
		</h2>
		<Label for="username">Username</Label>
		<Input type="text" id="username" name="username" placeholder="Username" autocomplete="username" data-invalid={$errors.username} bind:value={$form.username} required />
		<Label for="password">Password</Label>
		<Input type="password" id="password" name="password" placeholder="Password" autocomplete="password" data-invalid={$errors.password} bind:value={$form.password} required />
		<Button type="submit">Login</Button>
		{#if $errors._errors}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description>
					{$errors._errors}
				</Alert.Description>
			</Alert.Root>
		{/if}
		<p class="px-8 text-center text-sm text-muted-foreground">
			By clicking continue, you agree to our
			<a href="/terms" class="underline underline-offset-4 hover:text-primary">
				Terms of Use
			</a>
			and
			<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
				Privacy Policy
			</a>.
		</p>
	</form>
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