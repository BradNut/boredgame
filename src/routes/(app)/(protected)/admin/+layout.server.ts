import { redirect, loadFlash } from 'sveltekit-flash-message/server';
import { forbiddenMessage, notSignedInMessage } from '$lib/flashMessages';
import { eq } from 'drizzle-orm';
import db from '$lib/drizzle';
import { user_roles } from '../../../../schema';

export const load = loadFlash(async (event) => {
	const { locals } = event;
	if (!locals?.user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const { user } = locals;
	const userRoles = await db.query.user_roles.findMany({
		where: eq(user_roles.user_id, user.id),
		with: {
			role: {
				columns: {
					name: true
				}
			}
		}
	});

	const containsAdminRole = userRoles.some((user_role) => user_role?.role?.name === 'admin');
	if (!userRoles?.length || !containsAdminRole) {
		console.log('Not an admin');
		redirect(302, '/', forbiddenMessage, event);
	}

	return {};
});
