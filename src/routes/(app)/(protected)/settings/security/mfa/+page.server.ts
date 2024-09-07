import { notSignedInMessage } from '$lib/flashMessages'
import env from '$lib/server/api/common/env'
import { addTwoFactorSchema, removeTwoFactorSchema } from '$lib/validations/account'
import { type Actions, fail } from '@sveltejs/kit'
import kebabCase from 'just-kebab-case'
import { base32, decodeHex } from 'oslo/encoding'
import { createTOTPKeyURI } from 'oslo/otp'
import QRCode from 'qrcode'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad } from '../../$types'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	return {}
}

export const actions: Actions = {}
