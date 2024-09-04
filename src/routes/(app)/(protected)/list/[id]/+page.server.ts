import { notSignedInMessage } from '$lib/flashMessages'
import { gamesTable, wishlist_items, wishlistsTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { userNotAuthenticated } from '$lib/server/auth-utils'
import { modifyListGameSchema } from '$lib/validations/zod-schemas'
import { type Actions, fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'

export async function load(event) {
	const { params, locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	try {
		const wishlist = await db
			.select({
				wishlistId: wishlistsTable.id,
				wishlistItems: {
					id: wishlist_items.id,
					gameId: wishlist_items.game_id,
					gameName: gamesTable.name,
					gameThumbUrl: gamesTable.thumb_url,
				},
			})
			.from(wishlistsTable)
			.leftJoin(wishlist_items, eq(wishlistsTable.id, wishlist_items.wishlist_id))
			.leftJoin(gamesTable, eq(gamesTable.id, wishlist_items.game_id))
			.where(eq(wishlistsTable.id, params.id))
		return {
			wishlist,
		}
	} catch (e) {
		console.error(e)
		return {}
	}
}

export const actions: Actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { params, locals } = event
		const { user, session } = locals
		if (userNotAuthenticated(user, session)) {
			return fail(401)
		}
		const form = await superValidate(event, zod(modifyListGameSchema))

		if (!locals.user) {
			throw fail(401)
		}

		if (!params?.id) {
			throw fail(400, {
				message: 'Invalid Request',
			})
		}

		const game = await db.query.games.findFirst({
			where: eq(gamesTable.id, form.id),
		})

		if (!game) {
			return fail(400, {
				message: 'Game not found',
			})
		}

		const wishlist = await db.query.wishlists.findFirst({
			where: eq(wishlistsTable.id, params.id),
		})

		if (wishlist?.user_id !== locals.user.id) {
			return fail(401, {
				message: 'Unauthorized',
			})
		}

		if (!wishlist) {
			redirect(302, '/404')
		}

		const wishlistItem = await db.insert(wishlist_items).values({
			game_id: game.id,
			wishlist_id: wishlist.id,
		})

		if (!wishlistItem) {
			return fail(500, {
				message: 'Something went wrong',
			})
		}

		return {
			form,
		}
	},
	// Create new wishlist
	create: async (event) => {
		const { locals } = event
		const { user, session } = locals
		if (userNotAuthenticated(user, session)) {
			return fail(401)
		}
	},
	// Delete a wishlist
	delete: async (event) => {
		const { locals } = event
		const { user, session } = locals
		if (userNotAuthenticated(user, session)) {
			return fail(401)
		}
	},
	// Remove game from a wishlist
	remove: async (event) => {
		const { locals } = event
		const { user, session } = locals
		if (userNotAuthenticated(user, session)) {
			return fail(401)
		}
	},
}
