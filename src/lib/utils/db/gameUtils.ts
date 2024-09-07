import { PUBLIC_SITE_URL } from '$env/static/public'
import { type Games, externalIdsTable, gamesTable, gamesToExternalIdsTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import kebabCase from 'just-kebab-case'

export async function getGame(locals: App.Locals, id: string) {
	if (!id || id === '') {
		error(400, 'Invalid Request')
	}

	try {
		return await db.query.games.findFirst({
			where: eq(gamesTable.id, id),
		})
	} catch (e) {
		console.error(e)
		return new Response('Could not get gamesTable', {
			status: 500,
		})
	}
}

export async function createGame(locals: App.Locals, game: Games, externalId: string) {
	if (!game || !externalId || externalId === '') {
		error(400, 'Invalid Request')
	}

	try {
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIdsTable.externalId, externalId),
		})

		if (dbExternalId) {
			const foundGame = await db
				.select({
					id: gamesTable.id,
					name: gamesTable.name,
					slug: gamesTable.slug,
				})
				.from(gamesTable)
				.leftJoin(gamesToExternalIdsTable, eq(gamesToExternalIdsTable.externalId, externalId))
			console.log('Game already exists', foundGame)
			if (foundGame.length > 0) {
				console.log('Game name', foundGame[0].name)
				return new Response('Game already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/game/${foundGame[0].id}`,
					},
					status: 409,
				})
			}
		}

		let dbGames: Games[] = []
		console.log('Creating game', JSON.stringify(game, null, 2))
		await db.transaction(async (transaction) => {
			dbGames = await transaction
				.insert(gamesTable)
				.values({
					name: game.name,
					slug: kebabCase(game.name || game.slug || ''),
					description: game.description,
					year_published: game.year_published,
					url: game.url,
					image_url: game.image_url,
					thumb_url: game.thumb_url,
					min_age: game.min_age,
					min_players: game.min_players,
					max_players: game.max_players,
					min_playtime: game.min_playtime,
					max_playtime: game.max_playtime,
				})
				.returning()
			const dbExternalIds = await transaction
				.insert(externalIdsTable)
				.values({
					externalId,
					type: 'game',
				})
				.returning({ id: externalIdsTable.id })
			await transaction.insert(gamesToExternalIdsTable).values({
				gameId: dbGames[0].id,
				externalId: dbExternalIds[0].id,
			})
		})

		if (dbGames.length === 0) {
			return new Response('Could not create game', {
				status: 500,
			})
		}

		console.log('Created game', JSON.stringify(dbGames[0], null, 2))
		return new Response(JSON.stringify(dbGames[0]), {
			status: 201,
		})
	} catch (e) {
		console.error(e)
		throw new Error('Something went wrong creating Game')
	}
}

export async function createOrUpdateGameMinimal(locals: App.Locals, game: Games, externalId: string) {
	if (!game || !externalId || externalId === '') {
		error(400, 'Invalid Request')
	}

	console.log('Creating or updating minimal game data', JSON.stringify(game, null, 2))
	const externalUrl = `https://boardgamegeek.com/boardgame/${externalId}`
	try {
		let dbGames: Games[] = []
		console.log('Creating game', JSON.stringify(game, null, 2))
		await db.transaction(async (transaction) => {
			dbGames = await transaction
				.insert(gamesTable)
				.values({
					name: game.name,
					slug: kebabCase(game.name ?? game.slug ?? ''),
					description: game.description,
					year_published: game.year_published,
					url: externalUrl,
					image_url: game.image_url,
					thumb_url: game.thumb_url,
					min_age: game.min_age,
					min_players: game.min_players,
					max_players: game.max_players,
					min_playtime: game.min_playtime,
					max_playtime: game.max_playtime,
				})
				.onConflictDoUpdate({
					target: gamesTable.id,
					set: {
						name: game.name,
						slug: kebabCase(game.name || game.slug || ''),
						description: game.description,
						year_published: game.year_published,
						url: externalUrl,
						image_url: game.image_url,
						thumb_url: game.thumb_url,
						min_age: game.min_age,
						min_players: game.min_players,
						max_players: game.max_players,
						min_playtime: game.min_playtime,
						max_playtime: game.max_playtime,
					},
				})
				.returning()
			const dbExternalIds = await transaction
				.insert(externalIdsTable)
				.values({
					externalId,
					type: 'game',
				})
				.onConflictDoNothing()
				.returning({ id: externalIdsTable.id })
			await transaction
				.insert(gamesToExternalIdsTable)
				.values({
					gameId: dbGames[0].id,
					externalId: dbExternalIds[0].id,
				})
				.onConflictDoNothing()
		})

		if (dbGames.length === 0) {
			return new Response('Could not create game', {
				status: 500,
			})
		}

		console.log('Created game', JSON.stringify(dbGames[0], null, 2))
		return new Response(JSON.stringify(dbGames[0]), {
			status: 201,
		})
	} catch (e) {
		console.error(e)
		throw new Error('Something went wrong creating Game')
	}
}

export async function createOrUpdateGame(locals: App.Locals, game: Games, externalId: string) {
	if (!game || !externalId || externalId === '') {
		error(400, 'Invalid Request')
	}

	try {
		const externalUrl = `https://boardgamegeek.com/boardgame/${externalId}`
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIdsTable.externalId, externalId),
		})

		if (dbExternalId) {
			const foundGame = await db
				.select({
					id: gamesTable.id,
					name: gamesTable.name,
					slug: gamesTable.slug,
				})
				.from(gamesTable)
				.leftJoin(gamesToExternalIdsTable, eq(gamesToExternalIdsTable.externalId, externalId))
			console.log('Game already exists', foundGame)
			if (foundGame.length > 0) {
				console.log('Game name', foundGame[0].name)
				return new Response('Game already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/game/${foundGame[0].id}`,
					},
					status: 409,
				})
			}
		}

		let dbGames: Games[] = []
		console.log('Creating game', JSON.stringify(game, null, 2))
		await db.transaction(async (transaction) => {
			dbGames = await transaction
				.insert(gamesTable)
				.values({
					name: game.name,
					slug: kebabCase(game.name || game.slug || ''),
					description: game.description,
					year_published: game.year_published,
					url: game.url,
					image_url: game.image_url,
					thumb_url: game.thumb_url,
					min_age: game.min_age,
					min_players: game.min_players,
					max_players: game.max_players,
					min_playtime: game.min_playtime,
					max_playtime: game.max_playtime,
				})
				.onConflictDoUpdate({
					target: gamesTable.id,
					set: {
						name: game.name,
						slug: kebabCase(game.name || game.slug || ''),
						description: game.description,
						year_published: game.year_published,
						url: externalUrl,
						image_url: game.image_url,
						thumb_url: game.thumb_url,
						min_age: game.min_age,
						min_players: game.min_players,
						max_players: game.max_players,
						min_playtime: game.min_playtime,
						max_playtime: game.max_playtime,
					},
				})
				.returning()
			const dbExternalIds = await transaction
				.insert(externalIdsTable)
				.values({
					externalId,
					type: 'game',
				})
				.onConflictDoNothing()
				.returning({ id: externalIdsTable.id })
			await transaction
				.insert(gamesToExternalIdsTable)
				.values({
					gameId: dbGames[0].id,
					externalId: dbExternalIds[0].id,
				})
				.onConflictDoNothing()
		})

		if (dbGames.length === 0) {
			return new Response('Could not create game', {
				status: 500,
			})
		}

		console.log('Created game', JSON.stringify(dbGames[0], null, 2))
		return new Response(JSON.stringify(dbGames[0]), {
			status: 201,
		})
	} catch (e) {
		console.error(e)
		throw new Error('Something went wrong creating Game')
	}
}

export async function updateGame(locals: App.Locals, game: Games, id: string) {
	if (!game || !id || id === '') {
		error(400, 'Invalid Request')
	}

	try {
		const dbGame = await db
			.update(gamesTable)
			.set({
				name: game.name,
				slug: kebabCase(game.name || game.slug || ''),
				description: game.description,
				year_published: game.year_published,
				url: game.url,
				image_url: game.image_url,
				thumb_url: game.thumb_url,
				min_age: game.min_age,
				min_players: game.min_players,
				max_players: game.max_players,
				min_playtime: game.min_playtime,
				max_playtime: game.max_playtime,
			})
			.where(eq(gamesTable.id, id))
			.returning()
		return new Response(JSON.stringify(dbGame[0]), {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (e) {
		console.error(e)
		return new Response('Could not get publishersTable', {
			status: 500,
		})
	}
}

// console.log('Creating or updating game', JSON.stringify(game, null, 2));
// const categoryIds = game.categories;
// const mechanicIds = game.mechanicsTable;
// const publisherIds = game.publishersTable;
// const designerIds = game.designers;
// const artistIds = game.artists;
// // const expansionIds = game.expansionsTable;
// const externalUrl = `https://boardgamegeek.com/boardgame/${game.external_id}`;
// console.log('categoryIds', categoryIds);
// console.log('mechanicIds', mechanicIds);
// await db.transaction(async (transaction) => {
// 	const dbGame = await db.transaction(async (transaction) => {
// 		transaction.insert(gamesTable).values({
// 			name: game.name,
// 			slug: kebabCase(game.name || ''),
// 			description: game.description,
// 			external_id: game.external_id,
// 			url: externalUrl,
// 			thumb_url: game.thumb_url,
// 			image_url: game.image_url,
// 			min_age: game.min_age || 0,
// 			min_players: game.min_players || 0,
// 			max_players: game.max_players || 0,
// 			min_playtime: game.min_playtime || 0,
// 			max_playtime: game.max_playtime || 0,
// 			year_published: game.year_published || 0,
// 			last_sync_at: new Date(),
// 		}).onConflictDoUpdate({
// 			target: gamesTable.id, set: {
// 				name: game.name,
// 				slug: kebabCase(game.name),
// 				description: game.description,
// 				external_id: game.external_id,
// 				url: externalUrl,
// 				thumb_url: game.thumb_url,
// 				image_url: game.image_url,
// 				min_age: game.min_age || 0,
// 				min_players: game.min_players || 0,
// 				max_players: game.max_players || 0,
// 				min_playtime: game.min_playtime || 0,
// 				max_playtime: game.max_playtime || 0,
// 				year_published: game.year_published || 0,
// 				last_sync_at: new Date(),
// 			}
// 		}).returning();
// 	});
// 	// TODO: Connect to everything else
// });
// await db.insert(gamesTable).values({
// 	include: {
// 		mechanicsTable: true,
// 		publishersTable: true,
// 		designers: true,
// 		artists: true,
// 		expansionsTable: true
// 	},
// 	where: {
// 		external_id: game.external_id
// 	},
// 	create: {
// 		name: game.name,
// 		slug: kebabCase(game.name),
// 		description: game.description,
// 		external_id: game.external_id,
// 		url: externalUrl,
// 		thumb_url: game.thumb_url,
// 		image_url: game.image_url,
// 		min_age: game.min_age || 0,
// 		min_players: game.min_players || 0,
// 		max_players: game.max_players || 0,
// 		min_playtime: game.min_playtime || 0,
// 		max_playtime: game.max_playtime || 0,
// 		year_published: game.year_published || 0,
// 		last_sync_at: new Date(),
// 		categories: {
// 			connect: categoryIds
// 		},
// 		mechanicsTable: {
// 			connect: mechanicIds
// 		},
// 		publishersTable: {
// 			connect: publisherIds
// 		},
// 		designers: {
// 			connect: designerIds
// 		},
// 		artists: {
// 			connect: artistIds
// 		}
// 	},
// 	update: {
// 		name: game.name,
// 		slug: kebabCase(game.name),
// 		description: game.description,
// 		external_id: game.external_id,
// 		url: externalUrl,
// 		thumb_url: game.thumb_url,
// 		image_url: game.image_url,
// 		min_age: game.min_age || 0,
// 		min_players: game.min_players || 0,
// 		max_players: game.max_players || 0,
// 		min_playtime: game.min_playtime || 0,
// 		max_playtime: game.max_playtime || 0,
// 		year_published: game.year_published || 0,
// 		last_sync_at: new Date(),
// 		categories: {
// 			connect: categoryIds
// 		},
// 		mechanicsTable: {
// 			connect: mechanicIds
// 		},
// 		publishersTable: {
// 			connect: publisherIds
// 		},
// 		designers: {
// 			connect: designerIds
// 		},
// 		artists: {
// 			connect: artistIds
// 		}
// 	}
// });
