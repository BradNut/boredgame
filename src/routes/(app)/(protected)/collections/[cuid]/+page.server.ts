import { notSignedInMessage } from '$lib/flashMessages.js'
import { db } from '$lib/server/api/packages/drizzle'
import { userNotAuthenticated } from '$lib/server/auth-utils'
import { modifyListGameSchema } from '$lib/validations/zod-schemas'
import { type Actions, error, fail } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import { collection_items, collections, gamesTable } from '../../../../../lib/server/api/databases/tables'

export async function load(event) {
	const { params, locals } = event
	const { cuid } = params

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	try {
		const { data, errors } = await locals.api.collections[':cuid']
			.$get({
				param: { cuid },
			})
			.then(locals.parseApiResponse)

		if (errors) {
			return error(500, 'Failed to fetch collection')
		}

		const { collection } = data

		if (!collection) {
			redirect(302, '/404')
		}

		console.log('collection', collection)

		return {
			collection,
		}
	} catch (e) {
		console.error(e)
	}

	redirect(302, '/404')

	// const searchParams = Object.fromEntries(url?.searchParams);
	// console.log('searchParams', searchParams);
	// const q = searchParams?.q;
	// const limit = parseInt(searchParams?.limit) || 10;
	// const skip = parseInt(searchParams?.skip) || 0;
	//
	// const searchData = {
	// 	q,
	// 	limit,
	// 	skip,
	// };
	//
	// const searchForm = await superValidate(searchData, zod(search_schema));
	// const listManageForm = await superValidate(zod(modifyListGameSchema));
	//
	// const collection = await db.query.collections.findFirst({
	// 	columns: {
	// 		id: true,
	// 		cuid: true,
	// 		name: true,
	// 	},
	// 	where: and(eq(collections.user_id, user!.id!), eq(collections.cuid, id)),
	// });
	// console.log('collection', collection);

	// if (!collection) {
	// 	console.log('Collection was not found');
	// 	error(404, 'Collection was not found');
	// }
	//
	// const collectionItems = await db.query.collection_items.findMany({
	// 	columns: {
	// 		collection_id: true,
	// 		times_played: true,
	// 	},
	// 	where: eq(collection_items.collection_id, collection.id),
	// 	with: {
	// 		game: {
	// 			columns: {
	// 				id: true,
	// 				name: true,
	// 				thumb_url: true,
	// 			},
	// 		},
	// 	},
	// 	offset: skip,
	// 	limit,
	// });
	//
	// console.log('collection_items', collectionItems);
	//
	// const items: ListGame[] = [];
	// for (const item of collectionItems) {
	// 	console.log('item', item);
	// 	const game = item.game;
	// 	if (game) {
	// 		items.push({
	// 			game_id: '',
	// 			in_wishlist: false,
	// 			wishlist_id: '',
	// 			id: game.id,
	// 			collection_id: item.collection_id,
	// 			game_name: game.name ?? "Game doesn't have a name",
	// 			thumb_url: game.thumb_url,
	// 			times_played: item.times_played ?? 0,
	// 			in_collection: true,
	// 		});
	// 	}
	// }
	//
	// return {
	// 	searchForm,
	// 	listManageForm,
	// 	collection: {
	// 		name: collection.name,
	// 		cuid: collection.cuid ?? '',
	// 	},
	// 	items,
	// };
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
				where: eq(collections.user_id, authedUser.id),
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
