import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import db from '../../../../db';
import { wishlists } from '$db/schema';

export async function load({ locals }) {
	if (!locals.user) {
		throw fail(401);
	}

	try {
		const userWishlists = await db.query.wishlists.findMany({
			where: eq(wishlists.user_id, locals.user.id),
		});

		return {
			wishlsits: userWishlists,
		};
	} catch (e) {
		console.error(e);
	}
	return {
		wishlists: [],
	};
}
