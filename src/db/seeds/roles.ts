import { eq } from 'drizzle-orm';
import { type db } from '$db';
import * as schema from '$db/schema';
import roles from './data/roles.json';

export default async function seed(db: db) {
	console.log('Creating roles ...');
	for (const role of roles) {
		await db.insert(schema.roles).values(role).onConflictDoNothing();
	}
	console.log('Roles created.');
}
