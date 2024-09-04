import { PUBLIC_SITE_URL } from '$env/static/public'
import { type Categories, type Mechanics, categoriesTable, categoriesToExternalIdsTable, externalIdsTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import kebabCase from 'just-kebab-case'

export async function createCategory(locals: App.Locals, category: Categories, externalId: string) {
	if (!category || !externalId || externalId === '') {
		error(400, 'Invalid Request')
	}

	try {
		const dbExternalId = await db.query.externalIds.findFirst({
			where: eq(externalIdsTable.externalId, externalId),
		})

		if (dbExternalId) {
			const foundCategory = await db
				.select({
					id: categoriesTable.id,
					name: categoriesTable.name,
					slug: categoriesTable.slug,
				})
				.from(categoriesTable)
				.leftJoin(categoriesToExternalIdsTable, eq(categoriesToExternalIdsTable.externalId, externalId))
			console.log('Mechanic already exists', foundCategory)
			if (foundCategory.length > 0) {
				console.log('Mechanic name', foundCategory[0].name)
				return new Response('Mechanic already exists', {
					headers: {
						'Content-Type': 'application/json',
						Location: `${PUBLIC_SITE_URL}/api/mechanic/${foundCategory[0].id}`,
					},
					status: 409,
				})
			}
		}

		let dbCategory: Mechanics[] = []
		console.log('Creating category', JSON.stringify(category, null, 2))
		await db.transaction(async (transaction) => {
			dbCategory = await transaction
				.insert(categoriesTable)
				.values({
					name: category.name,
					slug: kebabCase(category.name ?? category.slug ?? ''),
				})
				.returning()
			const dbExternalIds = await transaction
				.insert(externalIdsTable)
				.values({
					externalId,
					type: 'category',
				})
				.returning({ id: externalIdsTable.id })
			await transaction.insert(categoriesToExternalIdsTable).values({
				categoryId: dbCategory[0].id,
				externalId: dbExternalIds[0].id,
			})
		})

		if (dbCategory.length === 0) {
			return new Response('Could not create category', {
				status: 500,
			})
		}

		console.log('Created category', JSON.stringify(dbCategory[0], null, 2))
		return new Response(JSON.stringify(dbCategory[0]), {
			status: 201,
		})
	} catch (e) {
		console.error(e)
		throw new Error('Something went wrong creating Category')
	}
}
