import { PUBLIC_SITE_URL } from '$env/static/public'
import { type Expansions, expansions } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { error } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'

export async function createExpansion(locals: App.Locals, expansion: Expansions) {
	if (!expansion || expansion?.base_game_id === '' || expansion?.game_id === '') {
		error(400, 'Invalid Request')
	}

	try {
		const foundExpansion = await db.query.expansions.findFirst({
			where: and(eq(expansions.base_game_id, expansion.base_game_id), eq(expansions.game_id, expansion.game_id)),
			columns: {
				id: true,
				game_id: true,
				base_game_id: true,
			},
		})
		console.log('Expansion already exists', foundExpansion)
		if (foundExpansion) {
			console.log('Expansion Game ID', foundExpansion.game_id)
			return new Response('Expansion already exists', {
				headers: {
					'Content-Type': 'application/json',
					Location: `${PUBLIC_SITE_URL}/api/game/${foundExpansion.game_id}`,
				},
				status: 409,
			})
		}

		console.log('Creating expansion', JSON.stringify(expansion, null, 2))
		const dbExpansion = await db
			.insert(expansions)
			.values({
				base_game_id: expansion.base_game_id,
				game_id: expansion.game_id,
			})
			.returning()

		if (dbExpansion.length === 0) {
			return new Response('Could not create expansion', {
				status: 500,
			})
		}

		console.log('Created expansion', JSON.stringify(dbExpansion[0], null, 2))
		return new Response(JSON.stringify(dbExpansion[0]), {
			status: 201,
		})
	} catch (e) {
		console.error(e)
		throw new Error('Something went wrong creating Expansion')
	}
}

// export async function createExpansion(
// 	locals: App.Locals,
// 	game: Game,
// 	externalExpansion: BggLinkDto,
// 	gameIsExpansion: boolean,
// 	eventFetch: Function
// ) {
// 	try {
// 		let dbExpansionGame = await prisma.game.findUnique({
// 			where: {
// 				external_id: externalExpansion.id
// 			}
// 		});

// 		if (!dbExpansionGame) {
// 			const externalGameResponse = await eventFetch(
// 				`/api/external/game/${externalExpansion.id}?simplified=true`
// 			);
// 			if (externalGameResponse.ok) {
// 				const externalGame = await externalGameResponse.json();
// 				console.log('externalGame', externalGame);
// 				const boredGame = mapAPIGameToBoredGame(externalGame);
// 				dbExpansionGame = await createOrUpdateGameMinimal(locals, boredGame);
// 			} else {
// 				throw new Error(
// 					`${gameIsExpansion ? 'Base game' : 'Expansion game'} not found and failed to create.`
// 				);
// 			}
// 		}

// 		let dbExpansion;
// 		let baseGameId;
// 		let gameId;
// 		if (gameIsExpansion) {
// 			console.log(
// 				'External expansion is expansion. Looking for base game',
// 				JSON.stringify(game, null, 2)
// 			);
// 			dbExpansion = await prisma.expansion.findFirst({
// 				where: {
// 					game_id: dbExpansionGame.id
// 				},
// 				select: {
// 					id: true,
// 					base_game_id: true,
// 					game_id: true
// 				}
// 			});
// 			baseGameId = game.id;
// 			gameId = dbExpansionGame.id;
// 		} else {
// 			console.log(
// 				'External Expansion is base game. Looking for expansion',
// 				JSON.stringify(game, null, 2)
// 			);
// 			dbExpansion = await prisma.expansion.findFirst({
// 				where: {
// 					base_game_id: dbExpansionGame.id
// 				},
// 				select: {
// 					id: true,
// 					base_game_id: true,
// 					game_id: true
// 				}
// 			});
// 			baseGameId = dbExpansionGame.id;
// 			gameId = game.id;
// 		}

// 		if (dbExpansion) {
// 			console.log('Expansion already exists', JSON.stringify(dbExpansion, null, 2));
// 			return dbExpansion;
// 		}

// 		console.log(`Creating expansion. baseGameId: ${baseGameId}, gameId: ${gameId}`);
// 		const expansion = await prisma.expansion.create({
// 			data: {
// 				base_game_id: baseGameId,
// 				game_id: gameId
// 			}
// 		});

// 		console.log('Created expansion', JSON.stringify(expansion, null, 2));

// 		if (gameIsExpansion) {
// 			console.log('Connecting current game to expansion');
// 			await prisma.game.update({
// 				where: {
// 					id: gameId
// 				},
// 				data: {
// 					expansions: {
// 						connect: {
// 							id: expansion.id
// 						}
// 					}
// 				}
// 			});
// 		} else {
// 			console.log('Connecting current game to base game');
// 			await prisma.game.update({
// 				where: {
// 					id: baseGameId
// 				},
// 				data: {
// 					expansions: {
// 						connect: {
// 							id: expansion.id
// 						}
// 					}
// 				}
// 			});
// 		}

// 		return expansion;
// 	} catch (e) {
// 		console.error(e);
// 		throw new Error('Something went wrong creating Expansion');
// 	}
// }
