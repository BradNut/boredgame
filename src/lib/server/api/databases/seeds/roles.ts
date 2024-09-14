import * as schema from '$lib/server/api/databases/tables'
import type { db } from '$lib/server/api/packages/drizzle'
import roles from './data/roles.json'

export default async function seed(db: db) {
	console.log('Creating rolesTable ...')
	for (const role of roles) {
		await db.insert(schema.rolesTable).values(role).onConflictDoNothing()
	}
	console.log('Roles created.')
}
