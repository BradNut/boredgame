import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { modifyListGameSchema, type ListGame } from '$lib/config/zod-schemas.js';
import { search_schema } from '$lib/zodValidation.js';
import type { PageServerLoad } from './$types';
import db from '$lib/drizzle';
import { collection_items, collections, games } from '../../../../schema';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/login');
	}

	// console.log('locals load', locals);
	const searchParams = Object.fromEntries(url?.searchParams);
	console.log('searchParams', searchParams);
	const q = searchParams?.q;
	const limit = parseInt(searchParams?.limit) || 10;
	const skip = parseInt(searchParams?.skip) || 0;

	const searchData = {
		q,
		limit,
		skip
	};

	const searchForm = await superValidate(searchData, zod(search_schema));
	const listManageForm = await superValidate(zod(modifyListGameSchema));

	try {
		const collection = await db.query.collections.findFirst({
			where: eq(collections.user_id, user.id)
		});
		console.log('collection', collection);

		if (!collection) {
			console.log('Collection was not found');
			return fail(404, {});
			// 	collection = await prisma.collection.create({
			// 		data: {
			// 			user_id: session.userId
			// 		}
			// 	});
		}

		const collectionItems = await db.query.collection_items.findMany({
			where: eq(collection_items.collection_id, collection.id),
			with: {
				game: {
					columns: {
						id: true,
						name: true,
						thumb_url: true
					}
				}
			},
			offset: skip,
			limit
		});

		console.log('collection_items', collectionItems);

		const items: ListGame[] = [];
		for (const item of collectionItems) {
			console.log('item', item);
			const game = item.game;
			if (game) {
				let collectionItem: ListGame = {
					id: game.id,
					collection_id: item.collection_id,
					name: game.name,
					thumb_url: game.thumb_url,
					times_played: item.times_played,
					in_collection: true
				};
				items.push(collectionItem);
			}
		}

		return {
			searchForm,
			listManageForm,
			collection: items
		};
	} catch (e) {
		console.error(e);
	}

	return {
		searchForm,
		listManageForm,
		collection: []
	};
};

export const actions: Actions = {
	// Add game to a wishlist
	add: async (event) => {
		const form = await superValidate(event, zod(modifyListGameSchema));

		if (!event.locals.user) {
			throw fail(401);
		}

		const user = event.locals.user;
		const game = await db.query.games.findFirst({
			where: eq(games.id, form.data.id)
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
				where: eq(collections.user_id, user.id)
			});

			if (!collection) {
				console.log('Wishlist not found');
				return error(404, 'Wishlist not found');
			}

			await db.insert(collection_items).values({
				game_id: game.id,
				collection_id: collection.id,
				times_played: 0
			});

			return {
				form
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
			where: eq(games.id, form.data.id)
		});

		if (!game) {
			console.log('game not found');
			redirect(302, '/404');
		}

		try {
			const collection = await db.query.collections.findFirst({
				where: eq(collections.user_id, locals.user.id)
			});

			if (!collection) {
				console.log('Collection not found');
				return error(404, 'Collection not found');
			}

			await db.delete(collection_items).where(and(
					eq(collection_items.collection_id, collection.id),
					eq(collection_items.game_id, game.id)
			));

			return {
				form
			};
		} catch (e) {
			console.error(e);
			return error(500, 'Something went wrong');
		}
	}
};
