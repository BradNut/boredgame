import { notSignedInMessage } from '$lib/flashMessages'
import { redirect } from 'sveltekit-flash-message/server'
import type { PageServerLoad } from '../../../$types'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	if (authedUser.mfa_enabled) {
		const { data: recoveryCodesData, error: recoveryCodesError } = await locals.api.mfa.totp.recoveryCodes.$get().then(locals.parseApiResponse)
		console.log('recoveryCodesData', recoveryCodesData)
		console.log('recoveryCodesError', recoveryCodesError)
		if (recoveryCodesError || !recoveryCodesData || !recoveryCodesData.recoveryCodes) {
			return {
				recoveryCodes: [],
			}
		}
		return {
			recoveryCodes: recoveryCodesData.recoveryCodes,
		}
	}

	redirect(302, '/profile', { message: 'Two-Factor Authentication is not enabled', type: 'error' }, event)
}
