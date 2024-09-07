import { notSignedInMessage } from '$lib/flashMessages'
import { db } from '$lib/server/api/packages/drizzle'
import { userNotAuthenticated } from '$lib/server/auth-utils'
import { modifyListGameSchema } from '$lib/validations/zod-schemas'
import { type Actions, error, fail } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import { collection_items, collections, gamesTable } from '../../../../lib/server/api/databases/tables'

export async function load(event) {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	try {
		const userCollections = await db.query.collections.findMany({
			columns: {
				cuid: true,
				name: true,
				created_at: true,
			},
			where: eq(collections.user_id, authedUser.id),
		})
		console.log('collections', userCollections)

		if (userCollections?.length === 0) {
			console.log('Collection was not found')
			return fail(404, {})
		}

		return {
			collections: userCollections,
		}
	} catch (e) {
		console.error(e)
	}

	return {
		collections: [],
	}
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

		const user = event.locals.user
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

		try {
			const collection = await db.query.collections.findFirst({
				where: eq(collections.user_id, user.id),
			})

			if (!collection) {
				console.log('Wishlist not found')
				return error(404, 'Wishlist not found')
			}

			await db.insert(collection_items).values({
				game_id: game.id,
				collection_id: collection.id,
				times_played: 0,
			})

			return {
				form,
			}
		} catch (e) {
			console.error(e)
			return error(500, 'Something went wrong')
		}
	},
	// Create new wishlist
	create: async ({ locals }) => {
		if (!locals.user) {
			throw fail(401)
		}
		return error(405, 'Method not allowed')
	},
	// Delete a wishlist
	delete: async ({ locals }) => {
		if (!locals.user) {
			throw fail(401)
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

		const game = await db.query.gamesTable.findFirst({
			where: eq(gamesTable.id, form.data.id),
		})

		if (!game) {
			console.log('game not found')
			redirect(302, '/404')
		}

		try {
			const collection = await db.query.collections.findFirst({
				where: eq(collections.user_id, authedUser.id),
			})

			if (!collection) {
				console.log('Collection not found')
				return error(404, 'Collection not found')
			}

			await db.delete(collection_items).where(and(eq(collection_items.collection_id, collection.id), eq(collection_items.game_id, game.id)))

			return {
				form,
			}
		} catch (e) {
			console.error(e)
			return error(500, 'Something went wrong')
		}
	},
}
