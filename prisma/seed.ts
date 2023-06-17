import { PrismaClient } from '@prisma/client';
// import userData from '../src/lib/data.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	const existingRoles = await prisma.role.findMany();
	if (existingRoles.length === 0) {
		await prisma.role.createMany({
			data: [{ name: 'admin' }, { name: 'user' }]
		});
		console.log('Roles created.');
	} else {
		console.log('Roles already exist. No action taken.');
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
