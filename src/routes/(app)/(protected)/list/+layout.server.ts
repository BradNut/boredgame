import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/login');
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
