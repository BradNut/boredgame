import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';

export const load = async ({ params, setHeaders, locals }) => {
	try {
		const { user } = locals;
		const { id } = params;
		const game = await prisma.game.findUnique({
			where: {
				id
			}
		});
		console.log('found game', game);

		if (!game) {
			throw error(404, 'not found');
		}

		let wishlist;
		let collection;
		if (user) {
			wishlist = await prisma.wishlist.findUnique({
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

			collection = await prisma.collection.findUnique({
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
