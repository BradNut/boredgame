import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import prisma from '$lib/prisma.js';
import { list_game_request_schema } from '$lib/zodValidation';

export async function load({ params, locals }) {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/auth/signin');
	}

	try {
		let wishlists = await prisma.wishlist.findMany({
			where: {
				user_id: session.userId
			},
			include: {
				items: true
			}
		});

		if (wishlists.length === 0) {
			const wishlist = await prisma.wishlist.create({
				data: {
					user_id: session.userId,
					name: 'My Wishlist'
				}
			});
			wishlists.push(wishlist);
		}

		return {
			wishlists
		};
	} catch (e) {
		console.error(e);
	}
}

export const actions = {
	// Add game to a wishlist
	add: async (event) => {
		const { params, locals, request } = event;
		const form = await superValidate(event, list_game_request_schema);

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
			const wishlist = await prisma.wishlist.create({
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
	remove: async ({ params, locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/auth/signin');
		}
	}
};
