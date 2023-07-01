<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { AlertCircle } from "lucide-svelte";
	import { userSchema } from '$lib/config/zod-schemas.js';
	import Label from '$components/ui/label/Label.svelte';
	import Input from '$components/ui/input/Input.svelte';
	import Button from '$components/ui/button/Button.svelte';
  import { Alert, AlertDescription, AlertTitle } from "$components/ui/alert";

	export let data;
	const { form, errors, enhance, delayed } = superForm(data.form, {
		taintedMessage: null,
		validationMethod: 'oninput',
		delayMs: 0,
	});
	console.log($errors);
</script>

<div>
	{#if $errors._errors}
		<Alert variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>
				{$errors._errors}
			</AlertDescription>
		</Alert>
	{/if}
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
</div>