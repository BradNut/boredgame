import { notSignedInMessage } from '$lib/flashMessages'
import { redirect } from 'sveltekit-flash-message/server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	return {
		hasSetupTwoFactor: authedUser.mfa_enabled,
	}
}

export const actions = {}
