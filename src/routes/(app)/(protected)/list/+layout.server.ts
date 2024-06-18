import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';
import db from '../../../../db';
import { wishlists } from '$db/schema';
import { userNotAuthenticated } from '$lib/server/auth-utils';
import { notSignedInMessage } from '$lib/flashMessages';

export async function load(event) {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	try {
		const dbWishlists = await db.query.wishlists.findMany({
			where: eq(wishlists.user_id, user!.id!),
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
