<script lang="ts">
  import { userSchema } from '$lib/config/zod-schemas.js';
  import { superForm } from 'sveltekit-superforms/client';

	export let data;

  const signUpSchema = userSchema.pick({
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    password: true
  });

  const { form, errors, constraints, enhance, delayed } = superForm(data.form, {
    taintedMessage: null,
    validators: signUpSchema,
    delayMs: 0,
  });
</script>

<div class="page">
	<form method="POST" action="/auth/signup" use:enhance>
    <h1>Signup user</h1>
    <label class="label">
			<span class="sr-only">First Name</span>
			<input
				id="firstName"
				name="firstName"
				type="text"
				placeholder="First Name"
				autocomplete="given-name"
				data-invalid={$errors.firstName}
				bind:value={$form.firstName}
				class="input"
				class:input-error={$errors.firstName}
			/>
			{#if $errors.firstName}
				<small>{$errors.firstName}</small>
			{/if}
		</label>
    <label class="label">
			<span class="sr-only">Last Name</span>
			<input
				id="lastName"
				name="lastName"
				type="text"
				placeholder="Last Name"
				autocomplete="family-name"
				data-invalid={$errors.lastName}
				bind:value={$form.lastName}
				class="input"
				class:input-error={$errors.lastName}
			/>
			{#if $errors.lastName}
				<small>{$errors.lastName}</small>
			{/if}
		</label>
    <label class="label">
			<span class="sr-only">Email</span>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="Email"
				autocomplete="email"
				data-invalid={$errors.email}
				bind:value={$form.email}
				class="input"
				class:input-error={$errors.email}
			/>
			{#if $errors.email}
				<small>{$errors.email}</small>
			{/if}
		</label>
    <label class="label">
			<span class="sr-only">Username</span>
			<input
				id="username"
				name="username"
				type="username"
				placeholder="Username"
				autocomplete="email"
				{...$constraints.username}
				data-invalid={$errors.username}
				bind:value={$form.username}
				class="input"
				class:input-error={$errors.username}
			/>
			{#if $errors.username}
				<small>{$errors.username}</small>
			{/if}
		</label>
    <label class="label">
			<span class="sr-only">password</span>
			<input
				id="password"
				name="password"
				type="password"
				placeholder="password"
				{...$constraints.username}
				data-invalid={$errors.password}
				bind:value={$form.password}
				class="input"
				class:input-error={$errors.password}
			/>
			{#if $errors.password}
				<small>{$errors.password}</small>
			{/if}
		</label>
    
    <button type="submit">Signup</button>

    <a class="back" href="/"> or Cancel </a>
  </form>
</div>

<style scoped>
  .page {
    padding: 3rem;
    display: flex;
    justify-content: center;
  }

  /* input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 0.25rem;
    border: 0.125rem solid rgba(0, 0, 0, 0.2);
  }

  button[type="submit"] {
    border: 0;
    padding: 1rem 2rem;
  } */

  .back {
    margin-left: 1rem;
  }
  .error {
    color: red;
  }
</style>