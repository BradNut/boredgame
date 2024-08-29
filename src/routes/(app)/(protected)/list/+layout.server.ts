import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/api/infrastructure/database';
import { wishlists } from '$lib/server/api/infrastructure/database/tables';
import { notSignedInMessage } from '$lib/flashMessages';

export async function load(event) {
	const { locals } = event;

	const authedUser = await locals.getAuthedUser();
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event);
	}

	try {
		const dbWishlists = await db.query.wishlists.findMany({
			where: eq(wishlists.user_id, authedUser.id),
		});

		return {
			wishlists: dbWishlists,
		};
	} catch (e) {
		console.error(e);
	}
	return {
		wishlists: [],
	};
}
