import db from '$lib/drizzle';
import { eq } from 'drizzle-orm';
import { users, type Users } from '../schema';
import { add_user_to_role } from './roles';

export function create_user(user: Users) {
	return db.insert(users).values({
		username: user.username
	});
}

export async function find_or_create_user(user: Users) {
	const existing_user = await db.query.users.findFirst({
		where: eq(users.username, user.username),
	});
	if (existing_user) {
		return existing_user;
	} else {
		const new_user = await create_user(user);
		add_user_to_role(new_user.id, 'user');
		return new_user;
	}
}

export async function find_user_with_roles(user_id: string) {
	const user_with_roles = await db.query.users.findFirst({
		where: eq(users.id, user_id),
		with: {
			user_roles: {
				with: {
					roles: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});
	if (!user_with_roles) {
		throw new Error('User not found');
	}

	const user = {
		...user_with_roles,
		roles: user_with_roles.roles.map((user_role) => user_role.role.name)
	};

	return user;
}
