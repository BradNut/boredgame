import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	console.log('Creating roles ...');
	const existingRoles = await prisma.role.findMany();
	if (existingRoles.length === 0) {
		await prisma.role.createMany({
			data: [{ name: 'admin' }, { name: 'user' }]
		});
		console.log('Roles created.');
	} else {
		console.log('Roles already exist. No action taken.');
	}

	if (!await prisma.publisher.findFirst({
		where: {
			external_id: 9999
		}
	})) {
		console.log('Publisher does not exist. Creating...');
		await prisma.publisher.create({
			data: {
				name: 'Unknown',
				slug: 'unknown',
				external_id: 9999
			}
		});
	}

	if (!await prisma.designer.findFirst({
		where: {
			external_id: 9999
		}
	})) {
		console.log('Designer does not exist. Creating...');
		await prisma.designer.create({
			data: {
				name: 'Unknown',
				slug: 'unknown',
				external_id: 9999
			}
		});
	}

	if (!await prisma.artist.findFirst({
		where: {
			external_id: 9999
		}
	})) {
		console.log('Artist does not exist. Creating...');
		await prisma.artist.create({
			data: {
				name: 'Unknown',
				slug: 'unknown',
				external_id: 9999
			}
		});
	}
	// for (const p of userData) {
	// 	const user = await prisma.user.create({
	// 		data: {
	// 			firstName: p.user.firstName,
	// 			lastName: p.user.lastName,
	// 			email: p.user.email,
	// 			username: p.user.username
	// 		}
	// 	});
	// 	console.log(`Created user with id: ${user.id}`);
	// }
	console.log(`Seeding finished.`);
}

main()
	.catch(async (e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
