import db from '../db';
import { eq } from 'drizzle-orm';
import { usersTable, type Users } from '$db/schema';
import { add_user_to_role } from './roles';

export function create_user(user: Users) {
	return db.insert(usersTable).values({
		username: user.username,
	});
}

export async function find_or_create_user(user: Users) {
	const existing_user = await db.query.usersTable.findFirst({
		where: eq(usersTable.username, user.username),
	});
	if (existing_user) {
		return existing_user;
	} else {
		const new_user = await create_user(user);
		add_user_to_role(new_user.id, 'user', true);
		return new_user;
	}
}

export async function find_user_with_roles(user_id: string) {
	const user_with_roles = await db.query.usersTable.findFirst({
		where: eq(usersTable.id, user_id),
		with: {
			user_roles: {
				with: {
					role: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
	if (!user_with_roles) {
		throw new Error('User not found');
	}

	return {
		...user_with_roles,
		roles: user_with_roles.role.map((user_role) => user_role.role.name),
	};
}
