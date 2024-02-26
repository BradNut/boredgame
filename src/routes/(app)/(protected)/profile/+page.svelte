<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { AlertTriangle, KeyRound } from 'lucide-svelte';
	import { changeEmailSchema, profileSchema } from '$lib/validations/account';
	import * as Alert from "$lib/components/ui/alert";
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';

	export let data;

	const { form: profileForm, errors: profileErrors, enhance: profileEnhance } = superForm(data.profileForm, {
		taintedMessage: null,
		validators: zodClient(profileSchema),
		delayMs: 0
	});

	const { form: emailForm, errors: emailErrors, enhance: emailEnhance } = superForm(data.emailForm, {
		taintedMessage: null,
		validators: zodClient(changeEmailSchema),
		delayMs: 0
	})
</script>

<form method="POST" use:profileEnhance>
	<!--<SuperDebug data={$form} />-->
	<h3>Your Profile</h3>
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
		<Input type="text" id="username" name="username" placeholder="Username" autocomplete="username" data-invalid={$profileErrors.username} bind:value={$profileForm.username} />
		{#if $profileErrors.username}
			<small>{$profileErrors.username}</small>
		{/if}
	</div>
	<div class="mt-6">
		<Label for="firstName">First Name</Label>
		<Input type="text" id="firstName" name="firstName" placeholder="First Name" autocomplete="given-name" data-invalid={$profileErrors.firstName} bind:value={$profileForm.firstName} />
		{#if $profileErrors.firstName}
			<small>{$profileErrors.firstName}</small>
		{/if}
	</div>
	<div class="mt-6">
		<Label for="lastName">Last Name</Label>
		<Input type="text" id="lastName" name="lastName" placeholder="Last Name" autocomplete="family-name" data-invalid={$profileErrors.lastName} bind:value={$profileForm.lastName} />
		{#if $profileErrors.lastName}
			<small>{$profileErrors.lastName}</small>
		{/if}
	</div>
	<div class="grid gap-2 mt-6">
		<Label for="email">Email address</Label>
		<Input
			type="email"
			id="email"
			name="email"
			placeholder="Email Address"
			autocorrect="off"
			autocomplete="email"
			data-invalid={$profileErrors.email}
			bind:value={$profileForm.email}
		/>
		<!-- <Input
			type="email"
			autocapitalize="none"
			autocorrect="off"
			autocomplete="username"
			bind:value={$profileFormData.email}
			{...attrs}
			{...constraints}
		/> -->
		{#if $profileErrors.email}
			<small>{$profileErrors.email}</small>
		{/if}
		{#if !$profileForm.email}
			<Alert.Root variant="destructive">
				<AlertTriangle class="h-4 w-4" />
				<Alert.Title>Heads up!</Alert.Title>
				<Alert.Description>
					Without an email, you won't be able to reset your password if you forget it.
				</Alert.Description>
			</Alert.Root>
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

<style lang="postcss">
	form {
		width: 20rem;
	}
</style>