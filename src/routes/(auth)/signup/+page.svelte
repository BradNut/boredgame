<script lang="ts">
import { Button } from '$components/ui/button';
import { Input } from '$components/ui/input';
import { Label } from '$components/ui/label';
import * as Alert from '$lib/components/ui/alert';
import * as Card from '$lib/components/ui/card';
import * as Collapsible from '$lib/components/ui/collapsible';
import { signupUsernameEmailDto } from '$lib/dtos/signup-username-email.dto';
import { receive, send } from '$lib/utils/pageCrossfade';
import { ChevronsUpDown } from 'lucide-svelte';
import { quintIn } from 'svelte/easing';
import { slide } from 'svelte/transition';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

const { data } = $props();

const signupForm = superForm(data.signupForm, {
	validators: zodClient(signupUsernameEmailDto),
	resetForm: false,
});

const { form: signupFormData, errors: signupErrors, enhance: signupEnhance } = signupForm;

let collapsibleOpen = $state(false);
</script>

<svelte:head>
	<title>Bored Game | Sign Up</title>
</svelte:head>

<div in:receive={{ key: 'auth-card' }} out:send={{ key: 'auth-card' }}>
	<Card.Root class="mx-auto mt-24 max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Signup for an account</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="POST" action="/signup" use:signupEnhance class="grid gap-2 mt-4">
				<Label for="username">Username <small>(required)</small></Label>
				<Input type="text" id="username" class={$signupErrors.username && "outline outline-destructive"} name="username"
							 placeholder="Username" autocomplete="username" data-invalid={$signupErrors.username} bind:value={$signupFormData.username} />
				{#if $signupErrors.username}
					<p class="text-sm text-destructive">{$signupErrors.username}</p>
				{/if}
				<Label for="password">Password <small>(required)</small></Label>
				<Input type="password" id="password" class={$signupErrors.password && "outline outline-destructive"} name="password"
							 placeholder="Password" autocomplete="new-password" data-invalid={$signupErrors.password}
							 bind:value={$signupFormData.password} />
				{#if $signupErrors.password}
					<p class="text-sm text-destructive">{$signupErrors.password}</p>
				{/if}
				<Label for="confirm_password">Confirm Password <small>(required)</small></Label>
				<Input type="password" id="confirm_password" class={$signupErrors.confirm_password && "outline outline-destructive"}
							 name="confirm_password" placeholder="Confirm Password" autocomplete="new-password"
							 data-invalid={$signupErrors.confirm_password} bind:value={$signupFormData.confirm_password} />
				{#if $signupErrors.confirm_password}
					<p class="text-sm text-destructive">{$signupErrors.confirm_password}</p>
				{/if}
				<Collapsible.Root bind:open={collapsibleOpen} class="grid w-full max-w-sm items-center gap-2.5">
					<div>
						Optional Fields:
						<Collapsible.Trigger asChild let:builder>
							<Button builders={[builder]} variant="ghost" size="sm" type="button" class="w-9 p-0">
								<ChevronsUpDown class="h-4 w-4" />
								<span class="sr-only">Toggle</span>
							</Button>
						</Collapsible.Trigger>
					</div>
					<Collapsible.Content>
						<div transition:slide|global={{ delay: 10, duration: 150, easing: quintIn }}>
							<Label for="email">Email</Label>
							<Input type="email" id="email" class={$signupErrors.email && "outline outline-destructive"} name="email"
										 placeholder="Email" autocomplete="email" data-invalid={$signupErrors.email} bind:value={$signupFormData.email} />
							{#if $signupErrors.email}
								<p class="text-sm text-destructive">{$signupErrors.email}</p>
							{/if}
						</div>
					</Collapsible.Content>
					<Collapsible.Content>
						<div transition:slide|global={{ delay: 10, duration: 150, easing: quintIn }}>
							<Label for="firstName">First Name</Label>
							<Input type="text" id="firstName" class={$signupErrors.firstName && "outline outline-destructive"} name="firstName"
										 placeholder="First Name" autocomplete="given-name" data-invalid={$signupErrors.firstName}
										 bind:value={$signupFormData.firstName} />
							{#if $signupErrors.firstName}
								<p class="text-sm text-destructive">{$signupErrors.firstName}</p>
							{/if}
						</div>
					</Collapsible.Content>
					<Collapsible.Content>
						<div transition:slide|global={{ delay: 10, duration: 150, easing: quintIn }}>
							<Label for="firstName">Last Name</Label>
							<Input type="text" id="lastName" class={$signupErrors.firstName && "outline outline-destructive"} name="lastName"
										 placeholder="Last Name" autocomplete="family-name" data-invalid={$signupErrors.lastName}
										 bind:value={$signupFormData.lastName} />
							{#if $signupErrors.lastName}
								<p class="text-sm text-destructive">{$signupErrors.lastName}</p>
							{/if}
						</div>
					</Collapsible.Content>
				</Collapsible.Root>
				<div class="grid grid-cols-2">
					<Button type="submit">Signup</Button>
					<Button variant="link" class="text-secondary-foreground" href="/">or Cancel</Button>
				</div>
				{#if !$signupFormData.email}
					<Alert.Root>
						<Alert.Title level="h3">Heads up!</Alert.Title>
						<Alert.Description>
							Without an email address, you won't be able to reset your password. Submit only if you are sure. You can
							always add this later.
						</Alert.Description>
					</Alert.Root>
				{/if}
			</form>
		</Card.Content>
	</Card.Root>
</div>

<style lang="postcss">
</style>