import { PUBLIC_SITE_URL } from '$env/static/public'
import { type Publishers, externalIds, publishers, publishersToExternalIds } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import kebabCase from 'just-kebab-case'

export async function getPublisher(locals: App.Locals, id: string) {
	const publisher = await db.select().from(publishers).where(eq(publishers.id, id))
	if (publisher.length === 0) {
		error(404, 'not found')
	}
	return new Response(JSON.stringify(publisher[0]), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export async function updatePublisher(locals: App.Locals, publisher: Publishers, id: string) {
	if (!publisher || publisher.name === '' || !id || id === '') {
		error(400, 'Invalid Request')
	}

	try {
		const dbPublisher = await db
			.update(publishers)
			.set({
				name: publisher.name,
				slug: kebabCase(publisher.name || ''),
			})
			.where(eq(publishers.id, id))
			.returning()
		return new Response(JSON.stringify(dbPublisher[0]), {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (e) {
		console.error(e)
		return new Response('Could not get publishers', {
			status: 500,
		})
	}
}

export async function createPublisher(locals: App.Locals, publisher: Publishers, externalId: string) {
	if (!publisher || !externalId || externalId === '') {
		error(400, 'Invalid Request')
	}

	try {
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIds.externalId, externalId),
		})

		if (dbExternalId) {
			const foundPublisher = await db
				.select({
					id: publishers.id,
					name: publishers.name,
					slug: publishers.slug,
				})
				.from(publishers)
				.leftJoin(publishersToExternalIds, eq(publishersToExternalIds.externalId, externalId))
			console.log('Publisher already exists', foundPublisher)
			if (foundPublisher.length > 0) {
				console.log('Publisher name', foundPublisher[0].name)
				return new Response('Publisher already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/publisher/${foundPublisher[0].id}`,
					},
					status: 409,
				})
			}
		}

		let dbPublishers: Publishers[] = []
		console.log('Creating publisher', JSON.stringify(publisher, null, 2))
		await db.transaction(async (transaction) => {
			dbPublishers = await transaction
				.insert(publishers)
				.values({
					name: publisher.name,
					slug: kebabCase(publisher.name || publisher.slug || ''),
				})
				.returning()
			const dbExternalIds = await transaction
				.insert(externalIds)
				.values({
					externalId,
					type: 'publisher',
				})
				.returning({ id: externalIds.id })
			await transaction.insert(publishersToExternalIds).values({
				publisherId: dbPublishers[0].id,
				externalId: dbExternalIds[0].id,
			})
		})

		if (dbPublishers.length === 0) {
			return new Response('Could not create publisher', {
				status: 500,
			})
		}

		console.log('Created publisher', JSON.stringify(dbPublishers[0], null, 2))
		return new Response(JSON.stringify(dbPublishers[0]), {
			status: 201,
		})
	} catch (e) {
		console.error(e)
		throw new Error('Something went wrong creating Publisher')
	}
}
