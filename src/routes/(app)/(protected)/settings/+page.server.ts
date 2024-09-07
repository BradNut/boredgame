// +page.server.ts
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	// Redirect to a different page
	throw redirect(307, '/settings/profile')
}
