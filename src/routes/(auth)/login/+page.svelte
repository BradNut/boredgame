<script lang="ts">
	import { Button } from "$components/ui/button";
	import * as Card from "$components/ui/card";
	import * as Form from "$components/ui/form";
	import { Input } from "$components/ui/input";
	import { boredState } from "$lib/stores/boredState.js";
	import { receive, send } from "$lib/utils/pageCrossfade";
	import * as flashModule from "sveltekit-flash-message/client";
	import { superForm } from "sveltekit-superforms/client";

	let { data } = $props();

	const superLoginForm = superForm(data.form, {
		onSubmit: () => boredState.update((n) => ({ ...n, loading: true })),
		onResult: () => boredState.update((n) => ({ ...n, loading: false })),
		flashMessage: {
			module: flashModule,
			onError: ({ result, flashMessage }) => {
				// Error handling for the flash message:
				// - result is the ActionResult
				// - message is the flash store (not the status message store)
				const errorMessage = result.error.message;
				flashMessage.set({ type: "error", message: errorMessage });
			},
		},
		syncFlashMessage: false,
		taintedMessage: null,
		// validators: zodClient(signInSchema),
		// validationMethod: 'oninput',
		delayMs: 0,
	});

	const { form: loginForm, enhance } = superLoginForm;
</script>

<svelte:head>
	<title>Bored Game | Login</title>
</svelte:head>

<div in:receive={{ key: "auth-card" }} out:send={{ key: "auth-card" }}>
	<Card.Root class="mx-auto mt-24 max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Log into your account</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			{@render usernamePasswordForm()}
			<span class="text-center text-sm text-muted-foreground">or sign in with</span>
			{@render oAuthButtons()}
			<p class="px-8 py-4 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary"> Terms of Use </a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary"> Privacy Policy </a>.
			</p>
		</Card.Content>
	</Card.Root>
</div>

{#snippet usernamePasswordForm()}
	<form method="POST" use:enhance>
		<Form.Field form={superLoginForm} name="username">
			<Form.Control let:attrs>
				<Form.Label for="username">Username</Form.Label>
				<Input {...attrs} autocomplete="username" bind:value={$loginForm.username} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={superLoginForm} name="password">
			<Form.Control let:attrs>
				<Form.Label for="password">Password</Form.Label>
				<Input {...attrs} autocomplete="current-password" type="password" bind:value={$loginForm.password} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="grid grid-cols-2">
			<Form.Button>Login</Form.Button>
			<Button variant="link" class="text-secondary-foreground" href="/password/reset">Forgot Password?</Button>
		</div>
	</form>
{/snippet}

{#snippet oAuthButtons()}
	<div class="grid gap-4">
		<Button href="/login/google" variant="outline" class="w-full flex items-center gap-2">
			<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
				><title>Google</title>
				<path
					d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
				/>
			</svg>
			Google
		</Button>
		<Button href="/login/github" variant="outline" class="w-full flex items-center gap-2">
			<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
				><title>GitHub</title>
				<path
					d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
				/>
			</svg>
			GitHub
		</Button>
	</div>
{/snippet}

<style lang="postcss">
	svg {
		width: 24px;
		height: 24px;
	}
</style>
