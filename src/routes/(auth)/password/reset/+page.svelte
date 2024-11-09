<script lang="ts">
import * as Card from '$components/ui/card';
import * as Form from '$components/ui/form';
import PinInput from '$lib/components/pin-input.svelte';
import { Button } from '$lib/components/ui/button/index.js';
import { Input } from '$lib/components/ui/input/index.js';
import { receive, send } from '$lib/utils/pageCrossfade';
import { resetPasswordEmailSchema, resetPasswordTokenSchema } from '$lib/validations/auth';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

const { data } = $props();

let showTokenVerification = $state(false);

const emailResetForm = superForm(data.emailForm, {
	validators: zodClient(resetPasswordEmailSchema),
	resetForm: false,
	onUpdated: ({ form }) => {
		if (form.valid) {
			showTokenVerification = true;
			$emailFormData.email = form.data.email;
		}
	},
});

const tokenVerificationForm = superForm(data.tokenForm, {
	validators: zodClient(resetPasswordTokenSchema),
	resetForm: false,
});

const { form: emailFormData, enhance: emailResetEnhance } = emailResetForm;
const { form: tokenFormData, enhance: tokenEnhance } = tokenVerificationForm;
</script>

<div out:send={{ key: 'auth-card' }} in:receive={{ key: 'auth-card' }}>
	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Reset Password</Card.Title>
			<Card.Description>Enter your email to reset your password</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				{#if showTokenVerification}
					{@render tokenForm()}
				{:else}
					{@render emailForm()}
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>

{#snippet emailForm()}
	<form method="POST" action="?/passwordReset" use:emailResetEnhance class="grid gap-4">
		<Form.Field form={emailResetForm} name="email">
			<Form.Control let:attrs>
				<Form.Label for="email">Email</Form.Label>
				<Input
						{...attrs}
						type="email"
						placeholder="you@awesome.com"
						bind:value={$emailFormData.email}
				/>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Button type="submit" class="w-full">Continue with Email</Button>
	</form>
{/snippet}

{#snippet tokenForm()}
	<form method="POST" action="?/verifyToken" use:tokenEnhance class="space-y-4">
		<input hidden value={$tokenFormData.resetToken} name="email" />
		<Form.Field form={tokenVerificationForm} name="resetToken">
			<Form.Control let:attrs>
				<Form.Label for="resetToken">Enter the token that was sent to your email</Form.Label>
				<PinInput class="justify-evenly" {...attrs} bind:value={$tokenFormData.resetToken} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Button class="w-full" type="submit">Submit</Button>
	</form>
{/snippet}