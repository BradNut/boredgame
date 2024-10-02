import { notSignedInMessage } from '$lib/flashMessages'
import env from '$lib/server/api/common/env'
import { decodeHex, encodeBase32 } from '@oslojs/encoding'
import { createTOTPKeyURI } from '@oslojs/otp'
import { type Actions, fail } from '@sveltejs/kit'
import kebabCase from 'just-kebab-case'
import QRCode from 'qrcode'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from '../../$types'
import { addTwoFactorSchema, removeTwoFactorSchema } from './schemas'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema))
	const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema))
	// const addAuthNFactorForm = await superValidate(event, zod(addAuthNFactorSchema));

	const { data, error } = await locals.api.mfa.totp.$get().then(locals.parseApiResponse)
	if (error || !data) {
		return fail(500, {
			addTwoFactorForm,
		})
	}
	const { totpCredential } = data
	if (totpCredential && authedUser.mfa_enabled) {
		return {
			addTwoFactorForm,
			removeTwoFactorForm,
			twoFactorEnabled: true,
			recoveryCodes: [],
			totpUri: '',
			qrCode: '',
		}
	}

	if (totpCredential && !authedUser.mfa_enabled) {
		await locals.api.mfa.totp.$delete().then(locals.parseApiResponse)
	}

	const issuer = kebabCase(env.PUBLIC_SITE_NAME)
	const accountName = authedUser.email || authedUser.username
	const { data: createdTotpData, error: createdTotpError } = await locals.api.mfa.totp.$post().then(locals.parseApiResponse)

	if (createdTotpError || !createdTotpData) {
		return fail(500, {
			addTwoFactorForm,
		})
	}

	const { totpCredential: createdTotpCredentials } = createdTotpData
	// pass the website's name and the user identifier (e.g. email, username)
	if (!createdTotpCredentials?.secret_data) {
		return fail(500, {
			addTwoFactorForm,
		})
	}
	const decodedHexSecret = decodeHex(createdTotpCredentials.secret_data)
	const secret = encodeBase32(decodedHexSecret)
	const intervalInSeconds = 30
	const digits = 6

	const totpUri = createTOTPKeyURI(issuer, accountName, decodedHexSecret, intervalInSeconds, digits)

	addTwoFactorForm.data = {
		current_password: '',
		two_factor_code: '',
	}
	return {
		addTwoFactorForm,
		removeTwoFactorForm,
		twoFactorEnabled: false,
		recoveryCodes: [],
		totpUri,
		qrCode: await QRCode.toDataURL(totpUri),
		secret,
	}
}

export const actions: Actions = {
	enableTotp: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}

		const addTwoFactorForm = await superValidate(event, zod(addTwoFactorSchema))

		if (!addTwoFactorForm.valid) {
			return fail(400, {
				addTwoFactorForm,
			})
		}

		const { error: verifyPasswordError } = await locals.api.me.verify.password
			.$post({
				json: { password: addTwoFactorForm.data.password },
			})
			.then(locals.parseApiResponse)

		if (verifyPasswordError) {
			console.log(verifyPasswordError)
			return setError(addTwoFactorForm, 'current_password', 'Your password is incorrect')
		}

		if (addTwoFactorForm.data.two_factor_code === '') {
			return setError(addTwoFactorForm, 'two_factor_code', 'Please enter a code')
		}

		const twoFactorCode = addTwoFactorForm.data.two_factor_code
		const { error: verifyTotpError } = await locals.api.mfa.totp.verify
			.$post({
				json: { code: twoFactorCode },
			})
			.then(locals.parseApiResponse)
		if (verifyTotpError) {
			return setError(addTwoFactorForm, 'two_factor_code', 'Invalid code')
		}

		redirect(302, '/settings/security/mfa/recovery-codes')
	},
	disableTotp: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}

		const removeTwoFactorForm = await superValidate(event, zod(removeTwoFactorSchema))

		if (!removeTwoFactorForm.valid) {
			return fail(400, {
				removeTwoFactorForm,
			})
		}
		const { error: verifyPasswordError } = await locals.api.me.verify.password
			.$post({
				json: { password: removeTwoFactorForm.data.password },
			})
			.then(locals.parseApiResponse)

		if (verifyPasswordError) {
			console.log(verifyPasswordError)
			return setError(removeTwoFactorForm, 'current_password', 'Your password is incorrect')
		}

		const { error: deleteTotpError } = await locals.api.mfa.totp.$delete().then(locals.parseApiResponse)
		if (deleteTotpError) {
			return fail(500, {
				removeTwoFactorForm,
			})
		}

		redirect(
			302,
			'/settings/security/mfa',
			{
				type: 'success',
				message: 'Two-Factor Authentication has been disabled.',
			},
			event,
		)
	},
}
