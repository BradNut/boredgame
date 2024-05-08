import { type Actions, error, fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { modifyListGameSchema, type ListGame } from '$lib/validations/zod-schemas';
import { search_schema } from '$lib/zodValidation.js';
import db from '../../../../db';
import { collection_items, collections, games } from '$db/schema';
import { notSignedInMessage } from '$lib/flashMessages';

export async function load(event) {
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	try {
		const userCollections = await db.query.collections.findMany({
			columns: {
				cuid: true,
				name: true,
				created_at: true,
			},
			where: eq(collections.user_id, user.id),
		});
		console.log('collections', userCollections);

		if (userCollections?.length === 0) {
			console.log('Collection was not found');
			return fail(404, {});
		}

		return {
			collections: userCollections,
		};
	} catch (e) {
		console.error(e);
	}

	return {
		collections: [],
	};
}

export const actions: Actions = {
	// Add game to a wishlist
	add: async (event) => {
		const form = await superValidate(event, zod(modifyListGameSchema));

		if (!event.locals.user) {
			throw fail(401);
		}

		const user = event.locals.user;
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

		try {
			const collection = await db.query.collections.findFirst({
				where: eq(collections.user_id, user.id),
			});

			if (!collection) {
				console.log('Wishlist not found');
				return error(404, 'Wishlist not found');
			}

			await db.insert(collection_items).values({
				game_id: game.id,
				collection_id: collection.id,
				times_played: 0,
			});

			return {
				form,
			};
		} catch (e) {
			console.error(e);
			return error(500, 'Something went wrong');
		}
	},
	// Create new wishlist
	create: async ({ locals }) => {
		if (!locals.user) {
			throw fail(401);
		}
		return error(405, 'Method not allowed');
	},
	// Delete a wishlist
	delete: async ({ locals }) => {
		if (!locals.user) {
			throw fail(401);
		}
		return error(405, 'Method not allowed');
	},
	// Remove game from a wishlist
	remove: async (event) => {
		const { locals } = event;
		const form = await superValidate(event, zod(modifyListGameSchema));

		if (!locals.user) {
			throw fail(401);
		}

		const game = await db.query.games.findFirst({
			where: eq(games.id, form.data.id),
		});

		if (!game) {
			console.log('game not found');
			redirect(302, '/404');
		}

		try {
			const collection = await db.query.collections.findFirst({
				where: eq(collections.user_id, locals.user.id),
			});

			if (!collection) {
				console.log('Collection not found');
				return error(404, 'Collection not found');
			}

			await db
				.delete(collection_items)
				.where(
					and(
						eq(collection_items.collection_id, collection.id),
						eq(collection_items.game_id, game.id),
					),
				);

			return {
				form,
			};
		} catch (e) {
			console.error(e);
			return error(500, 'Something went wrong');
		}
	},
};
