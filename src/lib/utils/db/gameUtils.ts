import kebabCase from 'just-kebab-case';
import db from '$lib/drizzle';
import { externalIds, gamesToExternalIds, type Games, games } from '../../../schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$env/static/public';

export async function getGame(locals: App.Locals, id: string) {
	if (!id || id === '') {
		error(400, 'Invalid Request');
	}

	try {
		return await db.query.games.findFirst({
			where: eq(games.id, id)
		});
	} catch (e) {
		console.error(e);
		return new Response('Could not get games', {
			status: 500
		});
	}
}

export async function createGame(locals: App.Locals, game: Games, externalId: string) {
	if (!game || !externalId || externalId === '') {
		error(400, 'Invalid Request');
	}

	try {
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIds.externalId, externalId)
		});

		if (dbExternalId) {
			const foundGame = await db
				.select({
					id: games.id,
					name: games.name,
					slug: games.slug
				})
				.from(games)
				.leftJoin(gamesToExternalIds, eq(gamesToExternalIds.externalId, externalId));
			console.log('Game already exists', foundGame);
			if (foundGame.length > 0) {
				console.log('Game name', foundGame[0].name);
				return new Response('Game already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/game/${foundGame[0].id}`
					},
					status: 409
				});
			}
		}

		let dbGames: Games[] = [];
		console.log('Creating game', JSON.stringify(game, null, 2));
		await db.transaction(async (transaction) => {
			dbGames = await transaction
				.insert(games)
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
					max_playtime: game.max_playtime
				})
				.returning();
			const dbExternalIds = await transaction
				.insert(externalIds)
				.values({
					externalId,
					type: 'game'
				})
				.returning({ id: externalIds.id });
			await transaction.insert(gamesToExternalIds).values({
				gameId: dbGames[0].id,
				externalId: dbExternalIds[0].id
			});
		});

		if (dbGames.length === 0) {
			return new Response('Could not create game', {
				status: 500
			});
		}

		console.log('Created game', JSON.stringify(dbGames[0], null, 2));
		return new Response(JSON.stringify(dbGames[0]), {
			status: 201,
		});
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Game');
	}
}

export async function createOrUpdateGameMinimal(locals: App.Locals, game: Games, externalId: string) {
	if (!game || !externalId || externalId === '') {
		error(400, 'Invalid Request');
	}

	console.log('Creating or updating minimal game data', JSON.stringify(game, null, 2));
	const externalUrl = `https://boardgamegeek.com/boardgame/${externalId}`;
	try {
		let dbGames: Games[] = [];
		console.log('Creating game', JSON.stringify(game, null, 2));
		await db.transaction(async (transaction) => {
			dbGames = await transaction
				.insert(games)
				.values({
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
					max_playtime: game.max_playtime
				})
				.onConflictDoUpdate({
					target: games.id,
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
						max_playtime: game.max_playtime
					}
				})
				.returning();
			const dbExternalIds = await transaction
				.insert(externalIds)
				.values({
					externalId,
					type: 'game'
				})
				.onConflictDoNothing()
				.returning({ id: externalIds.id });
			await transaction.insert(gamesToExternalIds).values({
				gameId: dbGames[0].id,
				externalId: dbExternalIds[0].id
			}).onConflictDoNothing();
		});

		if (dbGames.length === 0) {
			return new Response('Could not create game', {
				status: 500
			});
		}

		console.log('Created game', JSON.stringify(dbGames[0], null, 2));
		return new Response(JSON.stringify(dbGames[0]), {
			status: 201,
		});
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Game');
	}
}

export async function createOrUpdateGame(locals: App.Locals, game: Games, externalId: string) {
	if (!game || !externalId || externalId === '') {
		error(400, 'Invalid Request');
	}

	try {
		const externalUrl = `https://boardgamegeek.com/boardgame/${externalId}`;
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIds.externalId, externalId)
		});

		if (dbExternalId) {
			const foundGame = await db
				.select({
					id: games.id,
					name: games.name,
					slug: games.slug
				})
				.from(games)
				.leftJoin(gamesToExternalIds, eq(gamesToExternalIds.externalId, externalId));
			console.log('Game already exists', foundGame);
			if (foundGame.length > 0) {
				console.log('Game name', foundGame[0].name);
				return new Response('Game already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/game/${foundGame[0].id}`
					},
					status: 409
				});
			}
		}

		let dbGames: Games[] = [];
		console.log('Creating game', JSON.stringify(game, null, 2));
		await db.transaction(async (transaction) => {
			dbGames = await transaction
				.insert(games)
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
					max_playtime: game.max_playtime
				})
				.onConflictDoUpdate({
					target: games.id,
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
						max_playtime: game.max_playtime
					}
				})
				.returning();
			const dbExternalIds = await transaction
				.insert(externalIds)
				.values({
					externalId,
					type: 'game'
				})
				.onConflictDoNothing()
				.returning({ id: externalIds.id });
			await transaction.insert(gamesToExternalIds).values({
				gameId: dbGames[0].id,
				externalId: dbExternalIds[0].id
			}).onConflictDoNothing();
		});

		if (dbGames.length === 0) {
			return new Response('Could not create game', {
				status: 500
			});
		}

		console.log('Created game', JSON.stringify(dbGames[0], null, 2));
		return new Response(JSON.stringify(dbGames[0]), {
			status: 201,
		});
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Game');
	}
}

export async function updateGame(locals: App.Locals, game: Games, id: string) {
	if (!game || !id || id === '') {
		error(400, 'Invalid Request');
	}

	try {
		const dbGame = await db
			.update(games)
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
				max_playtime: game.max_playtime
			})
			.where(eq(games.id, id))
			.returning();
		return new Response(JSON.stringify(dbGame[0]), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (e) {
		console.error(e);
		return new Response('Could not get publishers', {
			status: 500
		});
	}
}

// console.log('Creating or updating game', JSON.stringify(game, null, 2));
	// const categoryIds = game.categories;
	// const mechanicIds = game.mechanics;
	// const publisherIds = game.publishers;
	// const designerIds = game.designers;
	// const artistIds = game.artists;
	// // const expansionIds = game.expansions;
	// const externalUrl = `https://boardgamegeek.com/boardgame/${game.external_id}`;
	// console.log('categoryIds', categoryIds);
	// console.log('mechanicIds', mechanicIds);
	// await db.transaction(async (transaction) => {
	// 	const dbGame = await db.transaction(async (transaction) => {
	// 		transaction.insert(games).values({
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
	// 			target: games.id, set: {
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
	// await db.insert(games).values({
	// 	include: {
	// 		mechanics: true,
	// 		publishers: true,
	// 		designers: true,
	// 		artists: true,
	// 		expansions: true
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
	// 		mechanics: {
	// 			connect: mechanicIds
	// 		},
	// 		publishers: {
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
	// 		mechanics: {
	// 			connect: mechanicIds
	// 		},
	// 		publishers: {
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