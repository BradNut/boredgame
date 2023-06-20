import prisma from '$lib/prisma';

export async function add_user_to_role(user_id: string, role_name: string) {
	// Find the role by its name
	const role = await prisma.role.findUnique({
		where: {
			name: role_name
		}
	});

	if (!role) {
		throw new Error(`Role with name ${role_name} not found`);
	}

	// Create a UserRole entry linking the user and the role
	const userRole = await prisma.userRole.create({
		data: {
			user: {
				connect: {
					id: user_id
				}
			},
			role: {
				connect: {
					id: role.id
				}
			}
		}
	});

	return userRole;
}
