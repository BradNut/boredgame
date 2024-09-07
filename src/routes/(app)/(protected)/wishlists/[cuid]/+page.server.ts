import { notSignedInMessage } from '$lib/flashMessages.js'
import { db } from '$lib/server/api/packages/drizzle'
import { userNotAuthenticated } from '$lib/server/auth-utils'
import { modifyListGameSchema } from '$lib/validations/zod-schemas'
import { type Actions, error, fail } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import { gamesTable, wishlist_items, wishlistsTable } from '../../../../../lib/server/api/databases/tables'

export async function load(event) {
	const { params, locals } = event
	const { cuid } = params

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	try {
		const { data, errors } = await locals.api.wishlists[':cuid']
			.$get({
				param: { cuid },
			})
			.then(locals.parseApiResponse)
		// const wishlist = await db.query.wishlistsTable.findMany({
		// 	where: and(eq(wishlistsTable.user_id, authedUser.id), eq(wishlistsTable.cuid, cuid)),
		// });
		if (errors) {
			return error(500, 'Failed to fetch wishlist')
		}
		const { wishlist } = data

		if (!wishlist) {
			redirect(302, '/404')
		}

		console.log('wishlist', wishlist)

		return {
			wishlist,
		}
	} catch (e) {
		console.error(e)
	}
	redirect(302, '/404')
}

export const actions: Actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}
		const form = await superValidate(event, zod(modifyListGameSchema))

		try {
			const game = await db.query.gamesTable.findFirst({
				where: eq(gamesTable.id, form.data.id),
			})

			if (!game) {
				// game = await prisma.game.create({
				// 	data: {
				// 		name: form.name
				// 	}
				// });
				console.log('game not found')
				redirect(302, '/404')
			}

			if (game) {
				const wishlist = await db.query.wishlistsTable.findFirst({
					where: eq(wishlistsTable.user_id, authedUser.id),
				})

				if (!wishlist) {
					console.log('Wishlist not found')
					return error(404, 'Wishlist not found')
				}

				await db.insert(wishlist_items).values({
					game_id: game.id,
					wishlist_id: wishlist.id,
				})
			}

			return {
				form,
			}
		} catch (e) {
			console.error(e)
			return error(500, 'Something went wrong')
		}
	},
	// Create new wishlist
	create: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}
		return error(405, 'Method not allowed')
	},
	// Delete a wishlist
	delete: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}
		return error(405, 'Method not allowed')
	},
	// Remove game from a wishlist
	remove: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}
		const form = await superValidate(event, zod(modifyListGameSchema))

		try {
			const game = await db.query.gamesTable.findFirst({
				where: eq(gamesTable.id, form.data.id),
			})

			if (!game) {
				// game = await prisma.game.create({
				// 	data: {
				// 		name: form.name
				// 	}
				// });
				console.log('game not found')
				redirect(302, '/404')
			}

			if (game) {
				const wishlist = await db.query.wishlistsTable.findFirst({
					where: eq(wishlistsTable.user_id, authedUser.id),
				})

				if (!wishlist) {
					console.log('Wishlist not found')
					return error(404, 'Wishlist not found')
				}

				await db.delete(wishlist_items).where(and(eq(wishlist_items.wishlist_id, wishlist.id), eq(wishlist_items.game_id, game.id)))
			}

			return {
				form,
			}
		} catch (e) {
			console.error(e)
			return error(500, 'Something went wrong')
		}
	},
}
