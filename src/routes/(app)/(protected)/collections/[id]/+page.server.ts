import { type Actions, error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { type ListGame, modifyListGameSchema } from '$lib/validations/zod-schemas';
import db from '$lib/drizzle.js';
import { notSignedInMessage } from '$lib/flashMessages.js';
import { collections, games, collection_items } from '../../../../../schema.js';
import { search_schema } from '$lib/zodValidation';
import type { UICollection } from '$lib/types';

export async function load(event) {
	const { locals, params, url } = event;
	const { user } = locals;
	const { id } = params;
	if (!user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const searchParams = Object.fromEntries(url?.searchParams);
	console.log('searchParams', searchParams);
	const q = searchParams?.q;
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;

	const searchData = {
		q,
		limit,
		skip,
	};

	const searchForm = await superValidate(searchData, zod(search_schema));
	const listManageForm = await superValidate(zod(modifyListGameSchema));

	const collection: UICollection | undefined = await db.query.collections.findFirst({
		columns: {
			id: true,
			cuid: true,
			name: true,
		},
		where: and(eq(collections.user_id, user.id), eq(collections.cuid, id)),
	});
	console.log('collection', collection);

	if (!collection) {
		console.log('Collection was not found');
		error(404, 'Collection was not found');
	}

	const collectionItems = await db.query.collection_items.findMany({
		columns: {
			collection_id: true,
			times_played: true,
		},
		where: eq(collection_items.collection_id, collection.id),
		with: {
			game: {
				columns: {
					id: true,
					name: true,
					thumb_url: true,
				},
			},
		},
		offset: skip,
		limit,
	});

	console.log('collection_items', collectionItems);

	const items: ListGame[] = [];
	for (const item of collectionItems) {
		console.log('item', item);
		const game = item.game;
		if (game) {
			items.push({
				game_id: '',
				in_wishlist: false,
				wishlist_id: '',
				id: game.id,
				collection_id: item.collection_id,
				game_name: game.name ?? "Game doesn't have a name",
				thumb_url: game.thumb_url,
				times_played: item.times_played ?? 0,
				in_collection: true,
			});
		}
	}

	return {
		searchForm,
		listManageForm,
		collection,
		items,
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
