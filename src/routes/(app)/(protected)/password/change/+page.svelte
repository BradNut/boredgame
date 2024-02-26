<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { changeUserPasswordSchema, userSchema } from '$lib/validations/zod-schemas.js';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	import { string } from 'zod';
	export let data;

	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		taintedMessage: null,
		validators: zodClient(changeUserPasswordSchema),
		delayMs: 0
	});
</script>

<form method="POST" use:enhance>
	<!--<SuperDebug data={$form} />-->
	<h3>Change Password</h3>
	<hr class="!border-t-2 mt-2 mb-6" />
	{#if $message}
		<aside class="alert variant-filled-success mt-6">
			<!-- Message -->
			<div class="alert-message">
				<p>{$message}</p>
			</div>
		</aside>
	{/if}
	<div class="mt-6">
		<Label for="current_password">Current Password</Label>
		<Input type="password" id="current_password" name="current_password" placeholder="Current Password" autocomplete="password" data-invalid={$errors.current_password} bind:value={$form.current_password} />
		{#if $errors.current_password}
			<small>{$errors.current_password}</small>
		{/if}
	</div>
	<div class="mt-6 grid">
		<Label for="password">New Password</Label>
		<Input type="password" id="password" name="password" placeholder="Password" autocomplete="given-name" data-invalid={$errors.password} bind:value={$form.password} />
		{#if $errors.password}
			<small>{$errors.password}</small>
		{/if}
	</div>
	<div class="mt-6">
		<Label for="confirm_password">Confirm New Password</Label>
		<Input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm Password" autocomplete="family-name" data-invalid={$errors.confirm_password} bind:value={$form.confirm_password} />
		{#if $errors.confirm_password}
			<small>{$errors.confirm_password}</small>
		{/if}
	</div>

	<div class="mt-6">
		<Button type="submit" class="w-full">Change Password</Button>
	</div>
</form>

<style lang="postcss">
	form {
		width: 20rem;
	}
</style>