import { loadFlash } from 'sveltekit-flash-message/server'
import type { LayoutServerLoad } from '../$types'

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { url, locals } = event
	const authedUser = await locals.getAuthedUser()

	return {
		url: url.pathname,
		authedUser,
	}
})
