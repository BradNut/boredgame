import type {NodePgDatabase} from 'drizzle-orm/node-postgres';
import * as schema from '../tables';
import roles from './data/roles.json';

export default async function seed(db: NodePgDatabase<typeof schema>) {
	console.log('Creating rolesTable ...');
	for (const role of roles) {
		await db.insert(schema.rolesTable).values(role).onConflictDoNothing();
	}
	console.log('Roles created.');
}
