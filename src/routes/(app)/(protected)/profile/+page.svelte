<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { AlertTriangle, KeyRound } from 'lucide-svelte';
	import { changeEmailSchema, profileSchema } from '$lib/validations/account';
	import * as Alert from "$lib/components/ui/alert";
	// import * as Form from '$lib/components/ui/form';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$components/ui/input';
	import { Button } from '$components/ui/button';

	export let data;

	const hasSetupTwoFactor = data.hasSetupTwoFactor;

	const { form: profileForm, errors: profileErrors, enhance: profileEnhance } = superForm(data.profileForm, {
		taintedMessage: null,
		validators: zodClient(profileSchema),
		delayMs: 500,
		multipleSubmits: 'prevent',
		syncFlashMessage: true,
		flashMessage: {
			module: flashModule,
		}
	});

	const { form: emailForm, errors: emailErrors, enhance: emailEnhance } = superForm(data.emailForm, {
		taintedMessage: null,
		validators: zodClient(changeEmailSchema),
		delayMs: 500,
		multipleSubmits: 'prevent',
		syncFlashMessage: true,
		flashMessage: {
			module: flashModule,
		}
	});
</script>

<form method="POST" action="?/profileUpdate" use:profileEnhance>
	<h3>Your Profile</h3>
	<hr class="!border-t-2 mt-2 mb-6" />
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
	<Button type="submit" class="w-full mt-3">Update Profile</Button>
</form>
<form method="POST" action="?/changeEmail" use:emailEnhance>
	<div class="grid gap-2 mt-6">
		<Label for="email">Email address</Label>
		<Input
			type="email"
			id="email"
			name="email"
			placeholder="Email Address"
			autocapitalize="none"
			autocorrect="off"
			autocomplete="email"
			data-invalid={$emailErrors.email}
			bind:value={$emailForm.email}
		/>
		{#if $emailErrors.email}
			<small>{$emailErrors.email}</small>
		{/if}
		<Button type="submit" class="w-full">Update Email</Button>
		{#if !$emailForm.email}
			<Alert.Root variant="destructive">
				<AlertTriangle class="h-4 w-4" />
				<Alert.Title>Heads up!</Alert.Title>
				<Alert.Description>
					Without an email, you won't be able to reset your password if you forget it.
				</Alert.Description>
			</Alert.Root>
		{/if}
	</div>
</form>
<div class="mt-6">
	{#if !hasSetupTwoFactor}
		<Button variant="link" class="text-secondary-foreground" href="/two-factor/setup">
			<KeyRound class="mr-2 h-4 w-4" />
			Setup 2FA
		</Button>
	{:else}
		<Button variant="link" class="text-secondary-foreground" href="/two-factor/disable">
			<KeyRound class="mr-2 h-4 w-4" />
			Disable 2FA
		</Button>
	{/if}
</div>
<div class="mt-6">
	<Button variant="link" class="text-secondary-foreground" href="/password/change">
		<KeyRound class="mr-2 h-4 w-4" />
		Change Password
	</Button>
</div>

<style lang="postcss">
	form {
		max-width: 20rem;
	}
</style>