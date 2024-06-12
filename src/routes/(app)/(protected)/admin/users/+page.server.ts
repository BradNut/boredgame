import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { notSignedInMessage } from '$lib/flashMessages';
import db from '../../../../../db';
import { userFullyAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const { user, session } = locals;
	if (userFullyAuthenticated(user, session)) {
		return fail(401);
	}

	const users = await db.query.users.findMany({
		limit: 10,
		offset: 0,
	});

	return {
		users,
	};
};
