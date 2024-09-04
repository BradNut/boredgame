import { collection_items, collections, expansionsTable, gamesTable, wishlist_items, wishlistsTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { createCategory } from '$lib/utils/db/categoryUtils'
import { createExpansion } from '$lib/utils/db/expansionUtils'
import { createOrUpdateGame } from '$lib/utils/db/gameUtils'
import { createMechanic } from '$lib/utils/db/mechanicUtils'
import { createPublisher } from '$lib/utils/db/publisherUtils'
import { mapAPIGameToBoredGame } from '$lib/utils/gameMapper.js'
import { error } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals, fetch }) => {
	try {
		const { user } = locals
		const { id } = params
		const game = await db.query.games.findFirst({
			where: eq(gamesTable.id, id),
			with: {
				publishers_to_games: {
					with: {
						publisher: {
							columns: {
								id: true,
								name: true,
							},
						},
					},
				},
				mechanics_to_games: {
					with: {
						mechanic: {
							columns: {
								id: true,
								name: true,
							},
						},
					},
				},
				categories_to_games: {
					with: {
						category: {
							columns: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
		})
		console.log('found game', game)

		if (!game) {
			error(404, 'not found')
		}

		const currentDate = new Date()
		if (game.last_sync_at === null || currentDate.getDate() - game.last_sync_at.getDate() > 7 * 24 * 60 * 60 * 1000) {
			console.log('Syncing details because last sync is out of date')
			await syncGameAndConnectedData(locals, game, fetch)
		}

		const gameExpansions = await db.query.expansions.findMany({
			where: eq(expansionsTable.base_game_id, game.id),
			with: {
				game: {
					columns: {
						id: true,
						name: true,
						thumb_url: true,
					},
				},
			},
		})

		let collectionItem
		let wishlistItem
		if (user) {
			const wishlist = await db.query.wishlists.findFirst({
				where: eq(wishlistsTable.user_id, user.id),
			})

			// TODO: Select wishlist items based on wishlist
			if (wishlist) {
				wishlistItem = await db.query.wishlist_items.findFirst({
					where: and(eq(wishlist_items.wishlist_id, wishlist.id), eq(wishlist_items.game_id, game.id)),
				})
			}

			const collection = await db.query.collections.findFirst({
				where: eq(collections.user_id, user.id),
			})

			// TODO: Select collection items based on collection

			if (collection) {
				collectionItem = await db.query.collection_items.findFirst({
					where: and(eq(collection_items.collection_id, collection.id), eq(collection_items.game_id, game.id)),
				})
			}
		}

		console.log('Returning game', game)

		return {
			game,
			expansions: gameExpansions,
			user,
			in_wishlist: wishlistItem !== undefined || false,
			in_collection: collectionItem !== undefined || false,
		}
	} catch (error) {
		console.log(error)
	}

	error(404, 'not found')
}

async function syncGameAndConnectedData(locals: App.Locals, game: Game, eventFetch: Function) {
	console.log(`Retrieving full external game details for external id: ${game.external_id} with name ${game.name}`)
	const externalGameResponse = await eventFetch(`/api/external/game/${game.external_id}`)
	if (externalGameResponse.ok) {
		const externalGame = await externalGameResponse.json()
		console.log('externalGame', externalGame)
		const categories = []
		const mechanics = []
		const publishers = []
		for (const externalCategory of externalGame.categories) {
			const category = await createCategory(locals, externalCategory, externalGame.external_id)
			categories.push({
				id: category.id,
			})
		}
		for (const externalMechanic of externalGame.mechanics) {
			const mechanic = await createMechanic(locals, externalMechanic, externalGame.external_id)
			mechanics.push({ id: mechanic.id })
		}
		for (const externalPublisher of externalGame.publishers) {
			const publisher = await createPublisher(locals, externalPublisher, externalGame.external_id)
			publishers.push({ id: publisher.id })
		}

		for (const externalExpansion of externalGame.expansions) {
			console.log('Inbound?', externalExpansion.inbound)
			if (externalExpansion?.inbound === true) {
				createExpansion(locals, externalExpansion)
			} else {
				createExpansion(locals, externalExpansion)
			}
		}

		const boredGame = mapAPIGameToBoredGame(externalGame)

		boredGame.categories = categories
		boredGame.mechanics = mechanics
		boredGame.publishers = publishers
		// boredGame.expansionsTable = expansionsTable;
		return createOrUpdateGame(locals, boredGame, externalGame.external_id)
	}
}
