import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../../$types.js';
import prisma from '$lib/prisma.js';
import { modifyListGameSchema, type ListGame } from '$lib/config/zod-schemas.js';
import type { CollectionItemWithGame } from '$lib/types.js';
import { search_schema } from '$lib/zodValidation.js';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/auth/signin');
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

	const searchForm = await superValidate(searchData, search_schema);
	const listManageForm = await superValidate(modifyListGameSchema);

	try {
		let collection = await prisma.collection.findUnique({
			where: {
				user_id: session.user.userId
			}
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

		let collection_items: CollectionItemWithGame[] = await prisma.collectionItem.findMany({
			where: {
				collection_id: collection.id
			},
			include: {
				game: {
					select: {
						id: true,
						name: true,
						thumb_url: true
					}
				}
			},
			skip,
			take: limit
		});

		console.log('collection_items', collection_items);

		let collectionItems: ListGame[] = [];
		for (const item of collection_items) {
			console.log('item', item);
			const game = item.game;
			if (game) {
				let collectionItem: ListGame = {
					id: item.id,
					collection_id: item.collection_id,
					game_id: game.id,
					game_name: game.name,
					thumb_url: game.thumb_url,
					times_played: item.times_played,
					wishlist_id: '',
					in_collection: true
				};
				collectionItems.push(collectionItem);
			}
		}

		return {
			searchForm,
			listManageForm,
			collection: collectionItems
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

export const actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { params, locals, request } = event;
		const form = await superValidate(event, modifyListGameSchema);

		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/auth/signin');
		}

		let game = await prisma.game.findUnique({
			where: {
				id: form.id
			}
		});

		if (!game) {
			game = await prisma.game.create({
				data: {
					name: form.name
				}
			});
			throw redirect(302, '/404');
		}

		if (game) {
			const wishlist = await prisma.collectionItem.create({
				data: {
					user_id: session.userId,
					name: form.name
				}
			});
		}

		return {
			form
		};
	},
	// Create new wishlist
	create: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/auth/signin');
		}
	},
	// Delete a wishlist
	delete: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/auth/signin');
		}
	},
	// Remove game from a wishlist
	remove: async (event) => {
		const { params, locals, request } = event;
		const form = await superValidate(event, modifyListGameSchema);

		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/auth/signin');
		}

		console.log('form', form);

		let collectionItem = await prisma.collectionItem.findUnique({
			where: {
				id: form.data.id
			},
			include: {
				collection: {
					select: {
						user_id: true
					}
				}
			}
		});
		console.log('collectionItem', collectionItem);
		const belongsToUser = collectionItem?.collection?.user_id === session.userId;
		console.log('belongsToUser', belongsToUser);

		if (!collectionItem || !belongsToUser) {
			// game = await prisma.game.create({
			// 	data: {
			// 		name: form.name
			// 	}
			// });
			throw redirect(302, '/404');
		}

		if (collectionItem) {
			console.log('Going to delete');
			await prisma.collectionItem.delete({
				where: {
					id: collectionItem.id
				}
			});
		}

		return {
			form,
			collection: []
		};
	}
};
