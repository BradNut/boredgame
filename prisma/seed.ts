import { PrismaClient } from '@prisma/client';
import kebabCase from 'just-kebab-case';
import { createId } from '@paralleldrive/cuid2';
import categories from './categories.json' assert { type: 'json' };
import mechanics from './mechanics.json' assert { type: 'json' };

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

	console.log('Creating Mechanics ...');
	const existingMechanics = await prisma.mechanic.findMany();
	if (existingMechanics.length === 0) {
		for (const mechanic of mechanics.mechanics) {
			await prisma.mechanic.create({
				data: {
					name: mechanic.name,
					external_id: createId(),
					slug: kebabCase(mechanic.name)
				}
			});
		}
		console.log('Mechanics created.');
	}

	console.log('Creating Categories ...');
	const existingCategories = await prisma.category.findMany();
	if (existingCategories.length === 0) {
		for (const category of categories.categories) {
			await prisma.category.create({
				data: {
					name: category.name,
					external_id: createId(),
					slug: kebabCase(category.name)
				}
			});
		}
		console.log('Categories created.');
	}

	await prisma.publisher.create({
		data: {
			name: 'Unknown',
			slug: 'unknown',
			external_id: createId()
		}
	});

	await prisma.designer.create({
		data: {
			name: 'Unknown',
			slug: 'unknown',
			external_id: createId()
		}
	});

	await prisma.artist.create({
		data: {
			name: 'Unknown',
			slug: 'unknown'
		}
	});

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
