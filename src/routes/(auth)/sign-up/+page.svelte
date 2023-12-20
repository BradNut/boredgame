<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintIn } from 'svelte/easing';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import toast from 'svelte-french-toast';
	import { ChevronsUpDown } from "lucide-svelte";
	import { Button } from '$components/ui/button';
	import { Label } from '$components/ui/label';
	import { Input } from '$components/ui/input';
	import { signUpSchema } from '$lib/config/zod-schemas.js';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Alert from '$lib/components/ui/alert';
	import { boredState } from '$lib/stores/boredState.js';
	import { onMount } from 'svelte';

	export let data;

  const { form, errors, enhance } = superForm(data.form, {
		onSubmit: () => boredState.update((n) => ({ ...n, loading: true })),
  	onResult: () => boredState.update((n) => ({ ...n, loading: false })),
		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				const errorMessage = result.error.message;
				message.set({ type: 'error', message: errorMessage });
			},
		},
    taintedMessage: null,
    validators: signUpSchema,
    delayMs: 0,
  });

	let collapsibleOpen = true;

	onMount(() => {
		collapsibleOpen = false;
	});
</script>

<svelte:head>
	<title>Bored Game | Sign Up</title>
</svelte:head>

<div class="sign-up">
	<form method="POST" action="/sign-up" use:enhance>
		<h2>Signup for an account</h2>
		<Label for="username">Username</Label>
		<Input type="text" id="username" class={$errors.username && "outline outline-destructive"} name="username" placeholder="Username" autocomplete="username" data-invalid={$errors.username} bind:value={$form.username} />
		{#if $errors.username}
			<p class="text-sm text-destructive">{$errors.username}</p>
		{/if}
		<Label for="password">Password</Label>
		<Input type="password" id="password" class={$errors.password && "outline outline-destructive"} name="password" placeholder="Password" autocomplete="new-password" data-invalid={$errors.password} bind:value={$form.password} />
		{#if $errors.password}
			<p class="text-sm text-destructive">{$errors.password}</p>
		{/if}
		<Label for="confirm_password">Confirm Password</Label>
		<Input type="password" id="confirm_password" class={$errors.confirm_password && "outline outline-destructive"} name="confirm_password" placeholder="Confirm Password" autocomplete="new-password" data-invalid={$errors.confirm_password} bind:value={$form.confirm_password} />
		{#if $errors.confirm_password}
			<p class="text-sm text-destructive">{$errors.confirm_password}</p>
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
					<Input type="email" id="email" class={$errors.email && "outline outline-destructive"} name="email" placeholder="Email" autocomplete="email" data-invalid={$errors.email} bind:value={$form.email} />
					{#if $errors.email}
						<p class="text-sm text-destructive">{$errors.email}</p>
					{/if}
				</div>
			</Collapsible.Content>
			<Collapsible.Content>
				<div transition:slide|global={{ delay: 10, duration: 150, easing: quintIn }}>
					<Label for="firstName">First Name</Label>
					<Input type="text" id="firstName" class={$errors.firstName && "outline outline-destructive"} name="firstName" placeholder="First Name" autocomplete="given-name" data-invalid={$errors.firstName} bind:value={$form.firstName} />
					{#if $errors.firstName}
						<p class="text-sm text-destructive">{$errors.firstName}</p>
					{/if}
				</div>
			</Collapsible.Content>
			<Collapsible.Content>
				<div transition:slide|global={{ delay: 10, duration: 150, easing: quintIn }}>
					<Label for="firstName">Last Name</Label>
					<Input type="text" id="lastName" class={$errors.firstName && "outline outline-destructive"} name="lastName" placeholder="Last Name" autocomplete="family-name" data-invalid={$errors.lastName} bind:value={$form.lastName} />
					{#if $errors.lastName}
						<p class="text-sm text-destructive">{$errors.lastName}</p>
					{/if}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
		<div class="grid grid-cols-2">
			<Button type="submit">Signup</Button>
			<Button variant="link" class="text-secondary-foreground" href="/">or Cancel</Button>
		</div>
		{#if !$form.email}
			<Alert.Root>
				<Alert.Title level="h3">Heads up!</Alert.Title>
				<Alert.Description>
					Without an email address, you won't be able to reset your password. Submit only if you are sure. You can always add this later.
				</Alert.Description>
			</Alert.Root>
		{/if}
  </form>
</div>

<style lang="postcss">
	.sign-up {
		display: flex;
		margin-top: 1.5rem;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		margin-right: auto;
		margin-left: auto;

		@media (min-width: 640px) {
			width: 350px;
		}

		form {
			display: grid;
			gap: 0.5rem;
			align-items: center;
			max-width: 24rem;

			h2:first-child {
				margin-top: 0;
			}

			h2 {
				padding-bottom: 0.5rem;
				border-bottom-width: 1px;
				font-size: 1.875rem;
				line-height: 2.25rem;
				font-weight: 600;
				letter-spacing: -0.025em;
				transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
				transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				transition-duration: 300ms;
				scroll-margin: 5rem;
			}
		}
	}
</style>