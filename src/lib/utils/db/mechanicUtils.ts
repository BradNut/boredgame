import kebabCase from 'just-kebab-case';
import db from '$lib/drizzle';
import { externalIds, mechanics, mechanicsToExternalIds, type Mechanics } from '../../../schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$env/static/public';

export async function createMechanic(locals: App.Locals, mechanic: Mechanics, externalId: string) {
	if (!mechanic || !externalId || externalId === '') {
		error(400, 'Invalid Request');
	}

	try {
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIds.externalId, externalId)
		});

		if (dbExternalId) {
			const foundMechanic = await db
				.select({
					id: mechanics.id,
					name: mechanics.name,
					slug: mechanics.slug
				})
				.from(mechanics)
				.leftJoin(mechanicsToExternalIds, eq(mechanicsToExternalIds.externalId, externalId));
			console.log('Mechanic already exists', foundMechanic);
			if (foundMechanic.length > 0) {
				console.log('Mechanic name', foundMechanic[0].name);
				return new Response('Mechanic already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/mechanic/${foundMechanic[0].id}`
					},
					status: 409
				});
			}
		}

		let dbMechanics: Mechanics[] = [];
		console.log('Creating mechanic', JSON.stringify(mechanic, null, 2));
		await db.transaction(async (transaction) => {
			dbMechanics = await transaction
				.insert(mechanics)
				.values({
					name: mechanic.name,
					slug: kebabCase(mechanic.name || mechanic.slug || '')
				})
				.returning();
			const dbExternalIds = await transaction
				.insert(externalIds)
				.values({
					externalId,
					type: 'mechanic'
				})
				.returning({ id: externalIds.id });
			await transaction.insert(mechanicsToExternalIds).values({
				mechanicId: dbMechanics[0].id,
				externalId: dbExternalIds[0].id
			});
		});

		if (dbMechanics.length === 0) {
			return new Response('Could not create mechanic', {
				status: 500
			});
		}

		console.log('Created mechanic', JSON.stringify(dbMechanics[0], null, 2));
		return new Response(JSON.stringify(dbMechanics[0]), {
			status: 201,
		});
	} catch (e) {
		console.error(e);
		throw new Error('Something went wrong creating Mechanic');
	}
}
