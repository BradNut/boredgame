<script lang="ts">
	import { page } from '$app/stores';
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
	import { slide } from 'svelte/transition';
	import { quintIn } from 'svelte/easing';

	export let data;

  const { form, errors, constraints, enhance, delayed } = superForm(data.form, {
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

	const flash = flashModule.getFlash(page);

	$: {
		if ($flash) {
			toast.error($flash.message, {
				duration: 5000
			});
		}
	}
</script>

<svelte:head>
	<title>Bored Game | Sign Up</title>
</svelte:head>

<div class="page">
	<form method="POST" action="/sign-up" use:enhance>
		<div class="grid w-full max-w-sm items-center gap-2.5">
			<h2
				class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				Signup for an account
			</h2>
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
			<Collapsible.Root class="grid w-full max-w-sm items-center gap-2.5">
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
		</div>
  </form>
</div>

<style scoped>
</style>