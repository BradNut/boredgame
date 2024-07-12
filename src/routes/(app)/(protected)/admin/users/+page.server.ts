import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import db from '../../../../../db';
import { userNotAuthenticated } from '$lib/server/auth-utils';
import { notSignedInMessage } from '$lib/flashMessages';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
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
