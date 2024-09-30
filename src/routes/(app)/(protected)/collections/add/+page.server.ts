import { notSignedInMessage } from '$lib/flashMessages'
import { userNotAuthenticated } from '$lib/server/auth-utils'
import { redirect } from 'sveltekit-flash-message/server'

export async function load(event) {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	return {}
}
