import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ locals }) {
	if (!locals.user) {
		throw fail(401);
	}

	try {
		let wishlists = await prisma.wishlist.findMany({
			where: {
				user_id: session.userId
			}
		});

		if (wishlists.length === 0) {
			const wishlist = await prisma.wishlist.create({
				data: {
					user_id: session.userId
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
	return {
		wishlists: []
	};
}
