import { error } from '@sveltejs/kit';
import {
	createArtist,
	createCategory,
	createDesigner,
	createExpansion,
	createMechanic,
	createOrUpdateGame,
	createPublisher
} from '$lib/utils/dbUtils.js';
import { mapAPIGameToBoredGame } from '$lib/utils/gameMapper.js';
import type { Game } from '@prisma/client';

export const load = async ({ params, locals, fetch }) => {
	try {
		const { user } = locals;
		const { id } = params;
		const game = await locals.prisma.game.findUnique({
			where: {
				id
			},
			include: {
				artists: true,
				designers: true,
				publishers: true,
				mechanics: true,
				categories: true,
				expansions: {
					include: {
						game: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				expansion_of: {
					include: {
						base_game: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		});
		console.log('found game', game);

		if (!game) {
			throw error(404, 'not found');
		}

		const currentDate = new Date();
		if (
			game.last_sync_at === null ||
			currentDate.getDate() - game.last_sync_at.getDate() > 7 * 24 * 60 * 60 * 1000
		) {
			await syncGameAndConnectedData(locals, game, fetch);
		}

		let wishlist;
		let collection;
		if (user) {
			wishlist = await locals.prisma.wishlist.findUnique({
				where: {
					user_id: user.userId
				},
				include: {
					items: {
						where: {
							game_id: game.id
						}
					}
				}
			});

			collection = await locals.prisma.collection.findUnique({
				where: {
					user_id: user.userId
				},
				include: {
					items: {
						where: {
							game_id: game.id
						}
					}
				}
			});
		}

		console.log('Returning game', game);

		return {
			game,
			user,
			in_wishlist: wishlist?.items?.length !== 0 || false,
			in_collection: collection?.items?.length !== 0 || false,
			wishlist,
			collection
		};
	} catch (error) {
		console.log(error);
	}

	throw error(404, 'not found');
};

async function syncGameAndConnectedData(locals: App.Locals, game: Game, eventFetch: Function) {
	console.log(
		`Retrieving full external game details for external id: ${game.external_id} with name ${game.name}`
	);
	const externalGameResponse = await eventFetch(`/api/external/game/${game.external_id}`);
	if (externalGameResponse.ok) {
		const externalGame = await externalGameResponse.json();
		console.log('externalGame', externalGame);
		let categories = [];
		let mechanics = [];
		let artists = [];
		let designers = [];
		let publishers = [];
		for (const externalCategory of externalGame.categories) {
			const category = await createCategory(locals, externalCategory);
			categories.push({
				id: category.id
			});
		}
		for (const externalMechanic of externalGame.mechanics) {
			const mechanic = await createMechanic(locals, externalMechanic);
			mechanics.push({ id: mechanic.id });
		}
		for (const externalArtist of externalGame.artists) {
			const artist = await createArtist(locals, externalArtist);
			artists.push({ id: artist.id });
		}
		for (const externalDesigner of externalGame.designers) {
			const designer = await createDesigner(locals, externalDesigner);
			designers.push({ id: designer.id });
		}
		for (const externalPublisher of externalGame.publishers) {
			const publisher = await createPublisher(locals, externalPublisher);
			publishers.push({ id: publisher.id });
		}

		for (const externalExpansion of externalGame.expansions) {
			console.log('Inbound?', externalExpansion.inbound);
			if (externalExpansion?.inbound === true) {
				createExpansion(locals, game, externalExpansion, false, eventFetch);
			} else {
				createExpansion(locals, game, externalExpansion, true, eventFetch);
			}
		}

		let boredGame = mapAPIGameToBoredGame(externalGame);

		boredGame.categories = categories;
		boredGame.mechanics = mechanics;
		boredGame.designers = designers;
		boredGame.artists = artists;
		boredGame.publishers = publishers;
		// boredGame.expansions = expansions;
		return createOrUpdateGame(locals, boredGame);
	}
}
