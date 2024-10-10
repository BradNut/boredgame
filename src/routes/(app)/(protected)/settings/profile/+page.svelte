<script context="module" lang="ts">
import type { updateEmailDto } from '$lib/server/api/dtos/update-email.dto';
import type { updateProfileDto } from '$lib/server/api/dtos/update-profile.dto';
import type { Infer, SuperValidated } from 'sveltekit-superforms';

interface UpdateProfileProps {
	updateEmailForm: SuperValidated<Infer<typeof updateEmailDto>>;
	updateProfileForm: SuperValidated<Infer<typeof updateProfileDto>>;
}
</script>

<script lang="ts">
import * as Alert from '$components/ui/alert'
import * as Form from '$components/ui/form'
import { Button } from '$components/ui/button'
import { Input } from '$components/ui/input'
import { Label } from '$components/ui/label'
import { AlertTriangle, KeyRound } from 'lucide-svelte'
import * as flashModule from 'sveltekit-flash-message/client'
import { zodClient } from 'sveltekit-superforms/adapters'
import { superForm } from 'sveltekit-superforms/client'
import { updateEmailFormSchema, updateProfileFormSchema } from './schemas'

const { data } = $props()
const { updateEmailForm, updateProfileForm }: UpdateProfileProps = data;

const sf_updateProfileForm = superForm(updateProfileForm, {
	validators: zodClient(updateProfileFormSchema),
	resetForm: false,
	onUpdated: ({ form }) => {
		if (!form.valid) return;
	},
	syncFlashMessage: true,
	flashMessage: {
		module: flashModule,
	},
})

const sf_updateEmailForm = superForm(updateEmailForm, {
	validators: zodClient(updateEmailFormSchema),
	resetForm: false,
	onUpdated: ({ form }) => {
		if (!form.valid) return;
	},
	syncFlashMessage: true,
	flashMessage: {
		module: flashModule,
	},
})

const {
	form: updateProfileFormData,
	submit: submitProfileForm,
	enhance: updateProfileFormEnhance,
} = sf_updateProfileForm;

const {
	form: updateEmailFormData,
	submit: submitEmailForm,
	enhance: updateEmailFormEnhance,
	errors: emailErrors,
} = sf_updateEmailForm;
</script>

<form method="POST" action="?/profileUpdate" use:updateProfileFormEnhance>
	<h3>Your Profile</h3>
	<hr class="!border-t-2 mt-2 mb-6" />
	<Form.Field form={sf_updateProfileForm} name="username">
		<Form.Control let:attrs>
			<Form.Label for="username">Username</Form.Label>
			<Input {...attrs} bind:value={$updateProfileFormData.username} />
			<Form.Description />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	<Form.Field form={sf_updateProfileForm} name="firstName">
		<Form.Control let:attrs>
			<Form.Label for="firstName">First Name</Form.Label>
			<Input {...attrs} bind:value={$updateProfileFormData.firstName} />
			<Form.Description />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	<Form.Field form={sf_updateProfileForm} name="lastName">
		<Form.Control let:attrs>
			<Form.Label for="lastName">Last Name</Form.Label>
			<Input {...attrs} bind:value={$updateProfileFormData.lastName} />
			<Form.Description />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	<Form.Button on:click={() => submitProfileForm()} class="w-full">Update Profile</Form.Button>
</form>
<form method="POST" action="?/changeEmail" use:updateEmailFormEnhance>
	<div class="grid gap-2 mt-6">
		<Form.Field form={sf_updateEmailForm} name="email">
			<Form.Control let:attrs>
				<Form.Label for="email">Email address</Form.Label>
				<Input {...attrs} bind:value={$updateEmailFormData.email} />
				<Form.Description />
				<Form.FieldErrors />
			</Form.Control>
		</Form.Field>
		<Form.Button on:click={() => submitEmailForm()} class="w-full">Update Email</Form.Button>
		{#if !$updateEmailFormData.email}
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

<style lang="postcss">
	form {
		max-width: 20rem;
	}
</style>