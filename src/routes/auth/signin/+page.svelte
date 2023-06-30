<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema } from '$lib/config/zod-schemas.js';
	import Label from '$components/ui/label/Label.svelte';
	import Input from '$components/ui/input/Input.svelte';
	import Button from '$components/ui/button/Button.svelte';

	export let data;

	const signInSchema = userSchema.pick({ username: true, password: true });
	const { form, errors, enhance, delayed } = superForm(data.form, {
		taintedMessage: null,
		validators: signInSchema,
		validationMethod: 'oninput',
		delayMs: 0,
	});
</script>

<form method="POST" use:enhance>
	{#if $errors._errors}
		<aside class="alert">
			<div class="alert-message">
				<h3>There was an error signing in</h3>
				<p>{$errors._errors}</p>
			</div>
		</aside>
	{/if}
	<div class="grid w-full max-w-sm items-center gap-2">
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Sign into your account
			</h2>
			<Label for="username">Username</Label>
			<Input type="text" id="username" name="username" placeholder="Username" autocomplete="username" data-invalid={$errors.username} bind:value={$form.username} />
			{#if $errors.username}
				<p class="text-sm text-muted-foreground">{$errors.username}</p>
			{/if}
			<Label for="password">Password</Label>
			<Input type="password" id="password" name="password" placeholder="Password" autocomplete="new-password" data-invalid={$errors.password} bind:value={$form.password} />
			{#if $errors.password}
				<p class="text-sm text-muted-foreground">{$errors.password}</p>
			{/if}
			<Button type="submit">Sign In</Button>
	</div>
</form>