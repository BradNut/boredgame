import type { PageServerLoad } from './$types';
import db from '../../../../../db';
import { userNotAuthenticated } from '$lib/server/auth-utils';

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
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
