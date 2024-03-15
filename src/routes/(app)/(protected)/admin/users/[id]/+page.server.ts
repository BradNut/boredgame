import { eq, inArray, not } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { notSignedInMessage } from '$lib/flashMessages';
import db from '$lib/drizzle';
import { roles, users } from '../../../../../../schema';

export const load: PageServerLoad = async (event) => {
	const { params } = event;
	const { id } = params;

	// TODO: Ensure admin user
	if (!event.locals.user) {
		redirect(302, '/login', notSignedInMessage, event);
	}

	const foundUser = await db.query.users.findFirst({
		where: eq(users.cuid, id),
		with: {
			user_roles: {
				with: {
					role: {
						columns: {
							name: true,
							cuid: true
						}
					}
				}
			}
		}
	});

	const currentRoleIds = foundUser?.user_roles?.map((user_role) => user_role?.role.cuid) || [];

	console.log('currentRoleIds', currentRoleIds);

	let availableRoles: { name: string; cuid: string }[] = [];
	if (currentRoleIds?.length > 0) {
		availableRoles = await db.query.roles.findMany({
			where: not(inArray(roles.cuid, currentRoleIds)),
			columns: {
				name: true,
				cuid: true
			}
		});
	}

	return {
		user: foundUser,
		availableRoles
	};
};

export const actions = {
	addRole: async (event) => {
		const { params, request } = event;
		d;
		const data = await request.formData();
		console.log('data', data);

		const roleCUID = data.get('value');
		const dbRole = await db.query.roles.findFirst({ where: eq(roles.cuid, roleCUID?.toString()) });
		console.log('dbRole', dbRole);
	}
};
