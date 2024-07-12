import { redirect, loadFlash } from 'sveltekit-flash-message/server';
import { forbiddenMessage, notSignedInMessage } from '$lib/flashMessages';
import { eq } from 'drizzle-orm';
import db from '../../../../db';
import { userRoles } from '$db/schema';
import { userNotAuthenticated } from '$lib/server/auth-utils';

export const load = loadFlash(async (event) => {
	const { locals } = event;
	const { user, session } = locals;
	if (userNotAuthenticated(user, session)) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const dbUserRoles = await db.query.userRoles.findMany({
		where: eq(userRoles.user_id, user!.id!),
		with: {
			role: {
				columns: {
					name: true,
				},
			},
		},
	});

	const containsAdminRole = dbUserRoles.some((userRole) => userRole?.role?.name === 'admin');
	if (!dbUserRoles?.length || !containsAdminRole) {
		console.log('Not an admin');
		redirect(302, '/', forbiddenMessage, event);
	}

	return {};
});
