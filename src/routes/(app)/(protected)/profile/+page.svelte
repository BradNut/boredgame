<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	//import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { userSchema } from '$lib/config/zod-schemas';
	import { AlertTriangle, KeyRound } from 'lucide-svelte';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';
	export let data;

	const profileSchema = userSchema.pick({
		firstName: true,
		lastName: true,
		email: true,
		username: true
	});

	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		taintedMessage: null,
		validators: profileSchema,
		delayMs: 0
	});
</script>

<form method="POST" use:enhance>
	<!--<SuperDebug data={$form} />-->
	<h3>Profile</h3>
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
		<Label for="username">Username</Label>
		<Input type="text" id="username" name="username" placeholder="Username" autocomplete="username" data-invalid={$errors.username} bind:value={$form.username} />
		{#if $errors.username}
			<small>{$errors.username}</small>
		{/if}
	</div>
	<div class="mt-6">
		<Label for="firstName">First Name</Label>
		<Input type="text" id="firstName" name="firstName" placeholder="First Name" autocomplete="given-name" data-invalid={$errors.firstName} bind:value={$form.firstName} />
		{#if $errors.firstName}
			<small>{$errors.firstName}</small>
		{/if}
	</div>
	<div class="mt-6">
		<Label for="lastName">Last Name</Label>
		<Input type="text" id="lastName" name="lastName" placeholder="Last Name" autocomplete="family-name" data-invalid={$errors.lastName} bind:value={$form.lastName} />
		{#if $errors.lastName}
			<small>{$errors.lastName}</small>
		{/if}
	</div>
	<div class="mt-6">
		<Label for="email">Email address</Label>
		<Input type="email" id="email" name="email" placeholder="Email Address" autocomplete="email" data-invalid={$errors.email} bind:value={$form.email} />
		{#if $errors.email}
			<small>{$errors.email}</small>
		{/if}
	</div>
	<div class="mt-6">
		<Button variant="link" class="text-secondary-foreground" href="/password/change">
			<KeyRound class="mr-2 h-4 w-4" />
			Change Password
		</Button>
	</div>

	<div class="mt-6">
		<Button type="submit" class="w-full">Update Profile</Button>
		<!-- <button type="submit" class="btn variant-filled-primary w-full"
			>{#if $delayed}<ConicGradient stops={conicStops} spin width="w-6" />{:else}Update Profile{/if}</button
		> -->
	</div>
</form>