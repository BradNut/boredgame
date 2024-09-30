import type { db } from '../../packages/drizzle'
import * as schema from '../tables'
import roles from './data/roles.json'

export default async function seed(db: db) {
	console.log('Creating rolesTable ...')
	for (const role of roles) {
		await db.insert(schema.rolesTable).values(role).onConflictDoNothing()
	}
	console.log('Roles created.')
}
