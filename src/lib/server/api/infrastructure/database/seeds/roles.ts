import { type db } from '$lib/server/api/infrastructure/database';
import * as schema from '$lib/server/api/infrastructure/database/tables';
import roles from './data/roles.json';

export default async function seed(db: db) {
	console.log('Creating roles ...');
	for (const role of roles) {
		await db.insert(schema.roles).values(role).onConflictDoNothing();
	}
	console.log('Roles created.');
}
