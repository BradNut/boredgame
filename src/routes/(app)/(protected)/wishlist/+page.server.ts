import { error, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import prisma from '$lib/prisma';
import { modifyListGameSchema } from '$lib/config/zod-schemas.js';

export async function load({ params, locals }) {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}

	console.log('Wishlist load User id', session.user);

	try {
		let wishlist = await prisma.wishlist.findUnique({
			where: {
				user_id: session?.user?.userId
			},
			include: {
				items: {
					include: {
						game: {
							select: {
								id: true,
								name: true,
								thumb_url: true
							}
						}
					}
				}
			}
		});

		if (!wishlist) {
			throw redirect(302, '/404');
		}

		console.log('wishlist', wishlist);

		return {
			items: wishlist?.items
		};
	} catch (e) {
		console.error(e);
	}
	redirect(302, '/404');
}

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
				const wishlist = await prisma.wishlist.findUnique({
					where: {
						user_id: session.user.userId
					}
				});

				if (!wishlist) {
					console.log('Wishlist not found');
					return error(404, 'Wishlist not found');
				}

				await prisma.wishlistItem.create({
					data: {
						game_id: game.id,
						wishlist_id: wishlist.id
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
				const wishlist = await prisma.wishlist.findUnique({
					where: {
						user_id: session.user.userId
					}
				});

				if (!wishlist) {
					console.log('Wishlist not found');
					return error(404, 'Wishlist not found');
				}

				await prisma.wishlistItem.delete({
					where: {
						wishlist_id: wishlist.id,
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
