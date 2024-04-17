import { error, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { modifyListGameSchema } from '$lib/validations/zod-schemas';
import db from '$lib/drizzle.js';
import { notSignedInMessage } from '$lib/flashMessages.js';
import { games, wishlist_items, wishlists } from '../../../../../schema.js';

export async function load(event) {
	const { params, locals } = event;
	const { id } = params;
	if (!locals.user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	console.log('Wishlist load User id', locals.user.id);

	try {
		const wishlist = await db.query.wishlists.findMany({
			where: and(eq(wishlists.user_id, locals.user.id), eq(wishlists.cuid, id)),
		});

		if (!wishlist) {
			redirect(302, '/404');
		}

		console.log('wishlist', wishlist);

		return {
			wishlist,
		};
	} catch (e) {
		console.error(e);
	}
	redirect(302, '/404');
}

export const actions: Actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { locals } = event;
		const form = await superValidate(event, zod(modifyListGameSchema));

		try {
			if (!locals.user) {
				redirect(302, '/login', notSignedInMessage, event);
			}

			const game = await db.query.games.findFirst({
				where: eq(games.id, form.data.id),
			});

			if (!game) {
				// game = await prisma.game.create({
				// 	data: {
				// 		name: form.name
				// 	}
				// });
				console.log('game not found');
				redirect(302, '/404');
			}

			if (game) {
				const wishlist = await db.query.wishlists.findFirst({
					where: eq(wishlists.user_id, locals.user.id),
				});

				if (!wishlist) {
					console.log('Wishlist not found');
					return error(404, 'Wishlist not found');
				}

				await db.insert(wishlist_items).values({
					game_id: game.id,
					wishlist_id: wishlist.id,
				});
			}

			return {
				form,
			};
		} catch (e) {
			console.error(e);
			return error(500, 'Something went wrong');
		}
	},
	// Create new wishlist
	create: async (event) => {
		const { locals } = event;
		if (!locals.user) {
			redirect(302, '/login', notSignedInMessage, event);
		}
		return error(405, 'Method not allowed');
	},
	// Delete a wishlist
	delete: async ({ locals }) => {
		if (!locals.user) {
			redirect(302, '/login');
		}
		return error(405, 'Method not allowed');
	},
	// Remove game from a wishlist
	remove: async (event) => {
		const { locals } = event;
		const form = await superValidate(event, zod(modifyListGameSchema));

		try {
			if (!locals.user) {
				redirect(302, '/login', notSignedInMessage, event);
			}

			const game = await db.query.games.findFirst({
				where: eq(games.id, form.data.id),
			});

			if (!game) {
				// game = await prisma.game.create({
				// 	data: {
				// 		name: form.name
				// 	}
				// });
				console.log('game not found');
				redirect(302, '/404');
			}

			if (game) {
				const wishlist = await db.query.wishlists.findFirst({
					where: eq(wishlists.user_id, locals.user.id),
				});

				if (!wishlist) {
					console.log('Wishlist not found');
					return error(404, 'Wishlist not found');
				}

				await db
					.delete(wishlist_items)
					.where(
						and(eq(wishlist_items.wishlist_id, wishlist.id), eq(wishlist_items.game_id, game.id)),
					);
			}

			return {
				form,
			};
		} catch (e) {
			console.error(e);
			return error(500, 'Something went wrong');
		}
	},
};
