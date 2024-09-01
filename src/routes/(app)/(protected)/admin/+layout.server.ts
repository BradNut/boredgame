import { forbiddenMessage, notSignedInMessage } from '$lib/flashMessages'
import { user_roles } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { eq } from 'drizzle-orm'
import { loadFlash, redirect } from 'sveltekit-flash-message/server'

export const load = loadFlash(async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	const dbUserRoles = await db.query.user_roles.findMany({
		where: eq(user_roles.user_id, authedUser.id),
		with: {
			role: {
				columns: {
					name: true,
				},
			},
		},
	})

	const containsAdminRole = dbUserRoles.some((userRole) => userRole?.role?.name === 'admin')
	if (!dbUserRoles?.length || !containsAdminRole) {
		console.log('Not an admin')
		redirect(302, '/', forbiddenMessage, event)
	}

	return {}
})
