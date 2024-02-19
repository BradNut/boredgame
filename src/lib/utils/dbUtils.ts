import type { Game } from '@prisma/client';
import kebabCase from 'just-kebab-case';
import type { BggLinkDto } from 'boardgamegeekclient/dist/esm/dto/concrete/subdto';
import { mapAPIGameToBoredGame } from './gameMapper';
import db from '$lib/drizzle';
import { externalIds, games, publishersToExternalIds, type Publishers, publishers } from '../../schema';
import { eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function createPublisher(locals: App.Locals, publisher: Publishers, externalId: string) {
	if (!publisher || !externalId || externalId === '') {
		error(400, 'Invalid Request');
	}

	try {
		let dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIds.id, externalId),
		});

		if (dbExternalId) {
			const dbPublisher = await db.select().from(publishers).leftJoin(publishersToExternalIds, eq(publishersToExternalIds.externalId, externalId));
		}
		let dbPublisher = await db.query.publishers.findFirst({
			where: eq(publishers.external_id, externalPublisher.id),
			columns: {
				id: true,
				name: true,
				slug: true,
				external_id: true
			},
			with: {
				publishersToExternalIds: {
					columns: {
						externalId: true
					}
				}
			}
		});
		if (dbPublisher) {
			console.log('Publisher already exists', dbPublisher.name);
			return dbPublisher;
		}
		console.log('Creating publisher', JSON.stringify(externalPublisher, null, 2));
		let publisher = await prisma.publisher.create({
			data: {
				name: externalPublisher.value,
				external_id: externalPublisher.id,
				slug: kebabCase(externalPublisher.value)
			},
			select: {
				id: true,
				name: true,
				slug: true,
				external_id: true
			}
		});

		console.log('Created publisher', JSON.stringify(publisher, null, 2));
		return publisher;
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Publisher');
	}
}

export async function createCategory(locals: App.Locals, externalCategory: BggLinkDto) {
	try {
		let dbCategory = await prisma.category.findFirst({
			where: {
				external_id: externalCategory.id
			},
			select: {
				id: true,
				name: true,
				slug: true,
				external_id: true
			}
		});
		if (dbCategory) {
			console.log('Category already exists', dbCategory.name);
			return dbCategory;
		}
		console.log('Creating category', JSON.stringify(externalCategory, null, 2));
		let category = await prisma.category.create({
			data: {
				name: externalCategory.value,
				external_id: externalCategory.id,
				slug: kebabCase(externalCategory.value)
			},
			select: {
				id: true,
				name: true,
				slug: true,
				external_id: true
			}
		});

		console.log('Created category', JSON.stringify(category, null, 2));

		return category;
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Category');
	}
}

export async function createMechanic(locals: App.Locals, externalMechanic: BggLinkDto) {
	try {
		let dbMechanic = await prisma.mechanic.findFirst({
			where: {
				external_id: externalMechanic.id
			},
			select: {
				id: true,
				name: true,
				slug: true,
				external_id: true
			}
		});
		if (dbMechanic) {
			console.log('Mechanic already exists', dbMechanic.name);
			return dbMechanic;
		}
		console.log('Creating mechanic', JSON.stringify(externalMechanic, null, 2));
		let mechanic = await prisma.mechanic.upsert({
			where: {
				external_id: externalMechanic.id
			},
			create: {
				name: externalMechanic.value,
				external_id: externalMechanic.id,
				slug: kebabCase(externalMechanic.value)
			},
			update: {
				name: externalMechanic.value,
				slug: kebabCase(externalMechanic.value)
			}
		});

		console.log('Created mechanic', JSON.stringify(mechanic, null, 2));

		return mechanic;
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Mechanic');
	}
}

export async function createExpansion(
	locals: App.Locals,
	game: Game,
	externalExpansion: BggLinkDto,
	gameIsExpansion: boolean,
	eventFetch: Function
) {
	try {
		let dbExpansionGame = await prisma.game.findUnique({
			where: {
				external_id: externalExpansion.id
			}
		});

		if (!dbExpansionGame) {
			const externalGameResponse = await eventFetch(
				`/api/external/game/${externalExpansion.id}?simplified=true`
			);
			if (externalGameResponse.ok) {
				const externalGame = await externalGameResponse.json();
				console.log('externalGame', externalGame);
				let boredGame = mapAPIGameToBoredGame(externalGame);
				dbExpansionGame = await createOrUpdateGameMinimal(locals, boredGame);
			} else {
				throw new Error(
					`${gameIsExpansion ? 'Base game' : 'Expansion game'} not found and failed to create.`
				);
			}
		}

		let dbExpansion;
		let baseGameId;
		let gameId;
		if (gameIsExpansion) {
			console.log(
				'External expansion is expansion. Looking for base game',
				JSON.stringify(game, null, 2)
			);
			dbExpansion = await prisma.expansion.findFirst({
				where: {
					game_id: dbExpansionGame.id
				},
				select: {
					id: true,
					base_game_id: true,
					game_id: true
				}
			});
			baseGameId = game.id;
			gameId = dbExpansionGame.id;
		} else {
			console.log(
				'External Expansion is base game. Looking for expansion',
				JSON.stringify(game, null, 2)
			);
			dbExpansion = await prisma.expansion.findFirst({
				where: {
					base_game_id: dbExpansionGame.id
				},
				select: {
					id: true,
					base_game_id: true,
					game_id: true
				}
			});
			baseGameId = dbExpansionGame.id;
			gameId = game.id;
		}

		if (dbExpansion) {
			console.log('Expansion already exists', JSON.stringify(dbExpansion, null, 2));
			return dbExpansion;
		}

		console.log(`Creating expansion. baseGameId: ${baseGameId}, gameId: ${gameId}`);
		let expansion = await prisma.expansion.create({
			data: {
				base_game_id: baseGameId,
				game_id: gameId
			}
		});

		console.log('Created expansion', JSON.stringify(expansion, null, 2));

		if (gameIsExpansion) {
			console.log('Connecting current game to expansion');
			await prisma.game.update({
				where: {
					id: gameId
				},
				data: {
					expansions: {
						connect: {
							id: expansion.id
						}
					}
				}
			});
		} else {
			console.log('Connecting current game to base game');
			await prisma.game.update({
				where: {
					id: baseGameId
				},
				data: {
					expansions: {
						connect: {
							id: expansion.id
						}
					}
				}
			});
		}

		return expansion;
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Expansion');
	}
}

export async function createOrUpdateGameMinimal(locals: App.Locals, game: Game) {
	console.log('Creating or updating minimal game data', JSON.stringify(game, null, 2));
	const externalUrl = `https://boardgamegeek.com/boardgame/${game.external_id}`;
	await db.insert(games).values({
		external_id: game.external_id,
		name: game.name,
		slug: kebabCase(game.name),
		description: game.description,
		url: externalUrl,
		thumb_url: game.thumb_url,
		image_url: game.image_url,
		min_age: game.min_age || 0,
		min_players: game.min_players || 0,
		max_players: game.max_players || 0,
		min_playtime: game.min_playtime || 0,
		max_playtime: game.max_playtime || 0,
		year_published: game.year_published || 0,
	}).onDuplicateKeyUpdate({ set: { external_id: sql`external_id` } });

	return db.query.games.findFirst({ where: eq(games.external_id, game.external_id) });
}

export async function createOrUpdateGame(locals: App.Locals, game: Game) {
	console.log('Creating or updating game', JSON.stringify(game, null, 2));
	const categoryIds = game.categories;
	const mechanicIds = game.mechanics;
	const publisherIds = game.publishers;
	const designerIds = game.designers;
	const artistIds = game.artists;
	// const expansionIds = game.expansions;
	const externalUrl = `https://boardgamegeek.com/boardgame/${game.external_id}`;
	console.log('categoryIds', categoryIds);
	console.log('mechanicIds', mechanicIds);
	await db.transaction(async (transaction) => {
		const dbGame = await transaction.insert(games).values({
			name: game.name,
			slug: kebabCase(game.name),
			description: game.description,
			external_id: game.external_id,
			url: externalUrl,
			thumb_url: game.thumb_url,
			image_url: game.image_url,
			min_age: game.min_age || 0,
			min_players: game.min_players || 0,
			max_players: game.max_players || 0,
			min_playtime: game.min_playtime || 0,
			max_playtime: game.max_playtime || 0,
			year_published: game.year_published || 0,
			last_sync_at: new Date(),
		}).onConflictDoUpdate({
			target: games.id, set: {
				name: game.name,
				slug: kebabCase(game.name),
				description: game.description,
				external_id: game.external_id,
				url: externalUrl,
				thumb_url: game.thumb_url,
				image_url: game.image_url,
				min_age: game.min_age || 0,
				min_players: game.min_players || 0,
				max_players: game.max_players || 0,
				min_playtime: game.min_playtime || 0,
				max_playtime: game.max_playtime || 0,
				year_published: game.year_published || 0,
				last_sync_at: new Date(),
			}
		}).returning();

		// TODO: Connect to everything else
		// await transaction.insert()
	});
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
	});
}
