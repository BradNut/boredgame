import { and, eq, inArray, not } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { forbiddenMessage, notSignedInMessage } from '$lib/flashMessages';
import db from '$lib/drizzle';
import { roles, user_roles, users } from '../../../../../../schema';

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

	const containsAdminRole = foundUser?.user_roles?.some(
		(user_role) => user_role?.role?.name === 'admin'
	);
	if (!containsAdminRole) {
		console.log('Not an admin');
		redirect(302, '/login', notSignedInMessage, event);
	}

	const currentRoleIds = foundUser?.user_roles?.map((user_role) => user_role?.role.cuid) || [];
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
		const { request, locals } = event;
		const { user } = locals;

		if (!user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		const userRoles = await db.query.user_roles.findMany({
			where: eq(user_roles.user_id, user.id),
			with: {
				role: {
					columns: {
						name: true,
						cuid: true
					}
				}
			}
		});

		console.log('userRoles', userRoles);

		const containsAdminRole = userRoles.some((user_role) => user_role?.role?.name === 'admin');
		console.log('containsAdminRole', containsAdminRole);
		if (!containsAdminRole) {
			redirect(302, '/', forbiddenMessage, event);
		}

		const data = await request.formData();
		const role = data.get('role');
		const dbRole = await db.query.roles.findFirst({
			where: eq(roles.cuid, role?.toString() ?? '')
		});
		console.log('dbRole', dbRole);
		if (dbRole) {
			await db.insert(user_roles).values({
				user_id: user.id,
				role_id: dbRole.id
			});
			redirect({ type: 'success', message: `Successfully added role ${dbRole.name}!` }, event);
		} else {
			redirect({ type: 'error', message: `Failed to add role ${dbRole.name}!` }, event);
		}
	},
	removeRole: async (event) => {
		const { request, locals } = event;
		const { user } = locals;
		if (!user) {
			redirect(302, '/login', notSignedInMessage, event);
		}

		const userRoles = await db.query.user_roles.findMany({
			where: eq(user_roles.user_id, user.id),
			with: {
				role: {
					columns: {
						name: true,
						cuid: true
					}
				}
			}
		});

		const containsAdminRole = userRoles.some((user_role) => user_role?.role?.name === 'admin');
		if (!containsAdminRole) {
			redirect(302, '/', forbiddenMessage, event);
		}

		const data = await request.formData();
		const role = data.get('role');
		const dbRole = await db.query.roles.findFirst({
			where: eq(roles.cuid, role?.toString() ?? '')
		});
		console.log('dbRole', dbRole);
		if (dbRole) {
			await db
				.delete(user_roles)
				.where(and(eq(user_roles.user_id, user.id), eq(user_roles.role_id, dbRole.id)));
			redirect({ type: 'success', message: `Successfully removed role ${dbRole.name}!` }, event);
		} else {
			redirect({ type: 'error', message: `Failed to remove role ${dbRole.name} !` }, event);
		}
	}
};
