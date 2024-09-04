import { PUBLIC_SITE_URL } from '$env/static/public'
import { type Mechanics, externalIdsTable, mechanicsTable, mechanicsToExternalIdsTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import kebabCase from 'just-kebab-case'

export async function createMechanic(locals: App.Locals, mechanic: Mechanics, externalId: string) {
	if (!mechanic || !externalId || externalId === '') {
		error(400, 'Invalid Request')
	}

	try {
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIdsTable.externalId, externalId),
		})

		if (dbExternalId) {
			const foundMechanic = await db
				.select({
					id: mechanicsTable.id,
					name: mechanicsTable.name,
					slug: mechanicsTable.slug,
				})
				.from(mechanicsTable)
				.leftJoin(mechanicsToExternalIdsTable, eq(mechanicsToExternalIdsTable.externalId, externalId))
			console.log('Mechanic already exists', foundMechanic)
			if (foundMechanic.length > 0) {
				console.log('Mechanic name', foundMechanic[0].name)
				return new Response('Mechanic already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/mechanic/${foundMechanic[0].id}`,
					},
					status: 409,
				})
			}
		}

		let dbMechanics: Mechanics[] = []
		console.log('Creating mechanic', JSON.stringify(mechanic, null, 2))
		await db.transaction(async (transaction) => {
			dbMechanics = await transaction
				.insert(mechanicsTable)
				.values({
					name: mechanic.name,
					slug: kebabCase(mechanic.name || mechanic.slug || ''),
				})
				.returning()
			const dbExternalIds = await transaction
				.insert(externalIdsTable)
				.values({
					externalId,
					type: 'mechanic',
				})
				.returning({ id: externalIdsTable.id })
			await transaction.insert(mechanicsToExternalIdsTable).values({
				mechanicId: dbMechanics[0].id,
				externalId: dbExternalIds[0].id,
			})
		})

		if (dbMechanics.length === 0) {
			return new Response('Could not create mechanic', {
				status: 500,
			})
		}

		console.log('Created mechanic', JSON.stringify(dbMechanics[0], null, 2))
		return new Response(JSON.stringify(dbMechanics[0]), {
			status: 201,
		})
	} catch (e) {
		console.error(e)
		throw new Error('Something went wrong creating Mechanic')
	}
}
