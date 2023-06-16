import { auth } from '$lib/server/lucia';
import prisma from '$lib/prisma';
import type { AuthUser } from '@prisma/client';
import { add_user_to_role } from './roles';

export function create_user(user: AuthUser) {
	return prisma.authUser.create({
		data: {
			username: user.username
		}
	});
}

export async function find_or_create_user(user: AuthUser) {
	const existing_user = await prisma.authUser.findUnique({
		where: {
			username: user.username
		}
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
	const user_with_roles = await prisma.authUser.findUnique({
		where: {
			id: user_id
		},
		include: {
			roles: {
				select: {
					role: {
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
