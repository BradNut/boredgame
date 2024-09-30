import { notSignedInMessage } from '$lib/flashMessages'
import { wishlistsTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { eq } from 'drizzle-orm'
import { redirect } from 'sveltekit-flash-message/server'

export async function load(event) {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	try {
		const dbWishlists = await db.query.wishlists.findMany({
			where: eq(wishlistsTable.user_id, authedUser.id),
		})

		return {
			wishlists: dbWishlists,
		}
	} catch (e) {
		console.error(e)
	}
	return {
		wishlists: [],
	}
}
