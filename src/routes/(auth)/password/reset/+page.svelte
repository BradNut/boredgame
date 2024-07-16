<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { resetPasswordEmailSchema, resetPasswordTokenSchema } from "$lib/validations/auth";
	import PinInput  from "$lib/components/pin-input.svelte";

	const {data} = $props();

	let showTokenVerification = $state(false);

	const emailResetForm = superForm(data.emailForm, {
		validators: zodClient(resetPasswordEmailSchema),
		resetForm: false,
		onUpdated: ({ form }) => {
			if (form.valid) {
				showTokenVerification = true;
				$emailFormData.email = form.data.email;
			}
		}
	});

	const tokenVerificationForm = superForm(data.tokenForm, {
		validators: zodClient(resetPasswordTokenSchema),
		resetForm: false
	});

	const { form: emailFormData, enhance: emailRegisterEnhance } = emailResetForm;
	const { form: tokenFormData, enhance: tokenEnhance } = tokenVerificationForm;

</script>

<Card.Root class="mx-auto mt-24 max-w-sm">
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

{#snippet emailForm()}
	<form method="POST" action="?/passwordReset" use:emailRegisterEnhance class="grid gap-4">
		<Form.Field form={emailResetForm} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
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
				<Form.Label />
				<PinInput class="justify-evenly" {...attrs} bind:value={$tokenFormData.resetToken} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Button class="w-full" type="submit">Submit</Button>
	</form>
{/snippet}