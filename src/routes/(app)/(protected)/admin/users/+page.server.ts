import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { notSignedInMessage } from '$lib/flashMessages';
import db from '../../../../../db';

export const load: PageServerLoad = async (event) => {
	// TODO: Ensure admin user
	if (!event.locals.user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const users = await db.query.users.findMany({
		limit: 10,
		offset: 0,
	});

	return {
		users,
	};
};
