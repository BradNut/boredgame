<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import toast from 'svelte-french-toast';
	import { AlertCircle } from "lucide-svelte";
	import { userSchema } from '$lib/config/zod-schemas.js';
	import Label from '$components/ui/label/Label.svelte';
	import Input from '$components/ui/input/Input.svelte';
	import Button from '$components/ui/button/Button.svelte';
  import { Alert, AlertDescription, AlertTitle } from "$components/ui/alert";

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

<div class="signin">
	<form method="POST" use:enhance>
		<div class="grid w-full max-w-sm items-center gap-2">
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Sign into your account
			</h2>
			<Label for="username">Username</Label>
			<Input type="text" id="username" name="username" placeholder="Username" autocomplete="username" data-invalid={$errors.username} bind:value={$form.username} />
			<Label for="password">Password</Label>
			<Input type="password" id="password" name="password" placeholder="Password" autocomplete="new-password" data-invalid={$errors.password} bind:value={$form.password} />
			<Button type="submit">Sign In</Button>
		</div>
	</form>
	{#if $errors._errors}
		<Alert variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>
				{$errors._errors}
			</AlertDescription>
		</Alert>
	{/if}
</div>

<style lang="postcss">
	.signin {
		display: grid;
		gap: 2rem;
	}
</style>