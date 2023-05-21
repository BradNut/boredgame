<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema } from '$lib/config/zod-schemas.js';

	export let data;
	const signInSchema = userSchema.pick({ username: true, password: true });
	const { form, errors, enhance, delayed } = superForm(data.form, {
		taintedMessage: null,
		validators: signInSchema,
		delayMs: 0,
	});
</script>

<form action="POST">
	{#if $errors._errors}
		<aside class="alert">
			<div class="alert-message">
				<h3>There was an error signing in</h3>
				<p>{$errors._errors}</p>
			</div>
		</aside>
	{/if}
	<div>
		<label class="label">
			<span class="sr-only">Username</span>
			<input
				id="username"
				name="username"
				type="text"
				placeholder="Username"
				autocomplete="username"
				data-invalid={$form.username}
				bind:value={$form.username}
				class="input"
				class:input-error={$errors.username}
			/>
			{#if $errors.username}
				<small>{$errors.username}</small>
			{/if}
		</label>
	</div>
	<div>
		<label class="label">
			<span class="sr-only">Password</span>
			<input
				id="password"
				name="password"
				type="password"
				placeholder="Password"
				data-invalid={$form.password}
				bind:value={$form.password}
				class="input"
				class:input-error={$errors.password}
			/>
			{#if $errors.password}
				<small>{$errors.password}</small>
			{/if}
		</label>
	</div>

	<div>
		<button type="submit" class="button">Sign In</button>
	</div>
</form>