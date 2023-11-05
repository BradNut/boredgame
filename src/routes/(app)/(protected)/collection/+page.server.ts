import { type Actions, error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms/server';
import prisma from '$lib/prisma';
import { modifyListGameSchema, type ListGame } from '$lib/config/zod-schemas.js';
import { search_schema } from '$lib/zodValidation.js';
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
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

		let collection_items = await prisma.collectionItem.findMany({
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
					id: game.id,
					collection_id: item.collection_id,
					name: game.name,
					thumb_url: game.thumb_url,
					times_played: item.times_played,
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

export const actions: Actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { params, locals, request } = event;
		const form = await superValidate(event, modifyListGameSchema);

		try {
			const session = await locals.auth.validate();
			if (!session) {
				throw redirect(302, '/login');
			}

			let game = await prisma.game.findUnique({
				where: {
					id: form.data.id
				}
			});

			if (!game) {
				// game = await prisma.game.create({
				// 	data: {
				// 		name: form.name
				// 	}
				// });
				console.log('game not found');
				throw redirect(302, '/404');
			}

			if (game) {
				const collection = await prisma.collection.findUnique({
					where: {
						user_id: session.user.userId
					}
				});

				if (!collection) {
					console.log('Wishlist not found');
					return error(404, 'Wishlist not found');
				}

				await prisma.collectionItem.create({
					data: {
						game_id: game.id,
						collection_id: collection.id,
						times_played: 0
					}
				});
			}

			return {
				form
			};
		} catch (e) {
			console.error(e);
			return error(500, 'Something went wrong');
		}
	},
	// Create new wishlist
	create: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/login');
		}
		return error(405, 'Method not allowed');
	},
	// Delete a wishlist
	delete: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/login');
		}
		return error(405, 'Method not allowed');
	},
	// Remove game from a wishlist
	remove: async (event) => {
		const { params, locals, request } = event;
		const form = await superValidate(event, modifyListGameSchema);

		try {
			const session = await locals.auth.validate();
			if (!session) {
				throw redirect(302, '/login');
			}

			let game = await prisma.game.findUnique({
				where: {
					id: form.data.id
				}
			});

			if (!game) {
				// game = await prisma.game.create({
				// 	data: {
				// 		name: form.name
				// 	}
				// });
				console.log('game not found');
				throw redirect(302, '/404');
			}

			if (game) {
				const collection = await prisma.collection.findUnique({
					where: {
						user_id: session.user.userId
					}
				});

				if (!collection) {
					console.log('Wishlist not found');
					return error(404, 'Wishlist not found');
				}

				await prisma.collectionItem.delete({
					where: {
						collection_id: collection.id,
						game_id: game.id
					}
				});
			}

			return {
				form
			};
		} catch (e) {
			console.error(e);
			return error(500, 'Something went wrong');
		}
	}
};
