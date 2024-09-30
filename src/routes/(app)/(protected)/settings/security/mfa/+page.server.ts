import { notSignedInMessage } from '$lib/flashMessages'
import type { Actions } from '@sveltejs/kit'
import { redirect } from 'sveltekit-flash-message/server'
import type { PageServerLoad } from '../../$types'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	const { data: totpData, error: totpDataError } = await locals.api.mfa.totp.$get().then(locals.parseApiResponse)

	const totpEnabled = !!totpData

	return {
		totpEnabled,
		hardwareTokenEnabled: false,
	}
}

export const actions: Actions = {}
