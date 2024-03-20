import db from '$lib/drizzle';
import { eq } from 'drizzle-orm';
import { roles, user_roles } from '../schema';

export async function add_user_to_role(user_id: string, role_name: string, primary = false) {
	// Find the role by its name
	const role = await db.query.roles.findFirst({
		where: eq(roles.name, role_name)
	});

	if (!role || !role.id) {
		throw new Error(`Role with name ${role_name} not found`);
	}

	// Create a UserRole entry linking the user and the role
	return await db.insert(user_roles).values({
		user_id,
		role_id: role.id,
		primary
	});
}
