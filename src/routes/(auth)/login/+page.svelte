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

	export let data;
	const { form, errors, enhance, delayed } = superForm(data.form, {
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
		<div class="grid w-full max-w-sm items-center gap-2">
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Log into your account
			</h2>
			<Label for="username">Username</Label>
			<Input type="text" id="username" name="username" placeholder="Username" autocomplete="username" data-invalid={$errors.username} bind:value={$form.username} required />
			<Label for="password">Password</Label>
			<Input type="password" id="password" name="password" placeholder="Password" autocomplete="password" data-invalid={$errors.password} bind:value={$form.password} required />
			<Button type="submit">Sign In</Button>
		</div>
	</form>
	{#if $errors._errors}
		<Alert.Root variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>
				{$errors._errors}
			</Alert.Description>
		</Alert.Root>
	{/if}
</div>

<style lang="postcss">
	.login {
		display: grid;
		gap: 2rem;
	}
</style>