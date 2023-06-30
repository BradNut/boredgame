<script lang="ts">
	import Button from '$components/ui/button/Button.svelte';
  import Input from '$components/ui/input/Input.svelte';
import Label from '$components/ui/label/Label.svelte';
import { userSchema } from '$lib/config/zod-schemas.js';
  import { superForm } from 'sveltekit-superforms/client';

	export let data;

  const signUpSchema = userSchema.pick({
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    password: true,
		confirm_password: true
  });

  const { form, errors, constraints, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: signUpSchema,
    delayMs: 0,
  });
</script>

<div class="page">
	<form method="POST" action="/auth/signup" use:enhance>
		<div class="grid w-full max-w-sm items-center gap-2">
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Signup for an account
			</h2>
			<Label for="firstName">First Name</Label>
			<Input type="text" id="firstName" name="firstName" placeholder="First Name" autocomplete="given-name" data-invalid={$errors.firstName} bind:value={$form.firstName} />
			{#if $errors.firstName}
				<p class="text-sm text-muted-foreground">{$errors.firstName}</p>
			{/if}
			<Label for="firstName">Last Name</Label>
			<Input type="text" id="lastName" name="lastName" placeholder="Last Name" autocomplete="family-name" data-invalid={$errors.lastName} bind:value={$form.lastName} />
			{#if $errors.lastName}
				<p class="text-sm text-muted-foreground">{$errors.lastName}</p>
			{/if}
			<Label for="email">Email</Label>
			<Input type="email" id="email" name="email" placeholder="Email" autocomplete="email" data-invalid={$errors.email} bind:value={$form.email} />
			{#if $errors.email}
				<p class="text-sm text-muted-foreground">{$errors.email}</p>
			{/if}
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
			<Label for="confirm_password">Confirm Password</Label>
			<Input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm Password" autocomplete="new-password" data-invalid={$errors.confirm_password} bind:value={$form.confirm_password} />
			{#if $errors.confirm_password}
				<p class="text-sm text-muted-foreground">{$errors.confirm_password}</p>
			{/if}
			<div class="flex place-content-">
				<Button type="submit">Signup</Button>
				<Button variant="link" href="/">or Cancel</Button>
			</div>
		</div>
  </form>
</div>

<style scoped>
</style>