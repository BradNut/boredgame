<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import { AlertTriangle } from 'lucide-svelte';
	import * as Alert from '$components/ui/alert';
	import * as Form from '$components/ui/form';
	import { Input } from '$components/ui/input';
	import { addTwoFactorSchema } from '$lib/validations/account';

	export let data;
	export let form;

	console.log('recovery codes', form.recoveryCodes)

	const { qrCode } = data;

	const twoFactorForm = superForm(data.form, {
		taintedMessage: null,
		validators: zodClient(addTwoFactorSchema),
		delayMs: 500,
		multipleSubmits: 'prevent',
	});

	const { form: formData, enhance } = twoFactorForm;
</script>

<h1>Two-Factor Authentication</h1>

<img src={qrCode} alt="QR Code" />
