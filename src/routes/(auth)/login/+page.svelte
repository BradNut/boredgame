<script lang="ts">
import * as Alert from '$components/ui/alert'
import { Button } from '$components/ui/button'
import { Input } from '$components/ui/input'
import { Label } from '$components/ui/label'
import * as Card from '$lib/components/ui/card'
import * as Form from '$lib/components/ui/form'
import { boredState } from '$lib/stores/boredState.js'
import { receive, send } from '$lib/utils/pageCrossfade'
import { signInSchema } from '$lib/validations/auth'
import { AlertCircle } from 'lucide-svelte'
import * as flashModule from 'sveltekit-flash-message/client'
import { zodClient } from 'sveltekit-superforms/adapters'
import { superForm } from 'sveltekit-superforms/client'
import { Github } from 'lucide-svelte'

let { data } = $props()

const superLoginForm = superForm(data.form, {
	onSubmit: () => boredState.update((n) => ({ ...n, loading: true })),
	onResult: () => boredState.update((n) => ({ ...n, loading: false })),
	flashMessage: {
		module: flashModule,
		onError: ({ result, flashMessage }) => {
			// Error handling for the flash message:
			// - result is the ActionResult
			// - message is the flash store (not the status message store)
			const errorMessage = result.error.message
			flashMessage.set({ type: 'error', message: errorMessage })
		},
	},
	syncFlashMessage: false,
	taintedMessage: null,
	// validators: zodClient(signInSchema),
	// validationMethod: 'oninput',
	delayMs: 0,
})

const { form: loginForm, enhance } = superLoginForm
</script>

<svelte:head>
	<title>Bored Game | Login</title>
</svelte:head>

<div in:receive={{ key: 'auth-card' }} out:send={{ key: 'auth-card' }}>
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
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Use
				</a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>.
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
		<Button href="/login/github" variant="outline" class="w-full"><Github class="mr-2 h-4 w-4" />GitHub</Button>
	</div>
{/snippet}

<style lang="postcss">
</style>