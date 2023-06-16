import prisma from '$lib/prisma';

export async function add_user_to_role(userId: string, roleName: string) {
	// Find the role by its name
	const role = await prisma.role.findUnique({
		where: {
			name: roleName
		}
	});

	if (!role) {
		throw new Error(`Role with name ${roleName} not found`);
	}

	// Create a UserRole entry linking the user and the role
	const userRole = await prisma.userRole.create({
		data: {
			user: {
				connect: {
					id: userId
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
