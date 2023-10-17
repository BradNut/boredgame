import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export async function load({ params, locals }) {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
	}

	try {
		let wishlist = await locals.prisma.wishlist.findUnique({
			where: {
				id: params.id,
				AND: {
					user_id: session.userId
				}
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

		return {
			wishlist
		};
	} catch (e) {
		console.error(e);
		return {};
	}
}

export const actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { params, locals, request } = event;
		const form = await superValidate(event, modifyListGameSchema);

		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/login');
		}

		let game = await locals.prisma.game.findUnique({
			where: {
				id: form.id
			}
		});

		if (!game) {
			// game = await locals.prisma.game.create({
			// 	data: {
			// 		name: form.name
			// 	}
			// });
			return fail(400, {
				message: 'Game not found'
			});
		}

		const wishlist = await locals.prisma.wishlist.findUnique({
			where: {
				id: params.id
			}
		});

		if (wishlist?.user_id !== session.userId) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		if (!wishlist) {
			throw redirect(302, '/404');
		}

		const wishlistItem = await locals.prisma.wishlistItem.create({
			data: {
				game_id: game.id,
				wishlist_id: wishlist.id
			}
		});

		if (!wishlistItem) {
			return fail(500, {
				message: 'Something went wrong'
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
			throw redirect(302, '/login');
		}
	},
	// Delete a wishlist
	delete: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/login');
		}
	},
	// Remove game from a wishlist
	remove: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/login');
		}
	}
};
