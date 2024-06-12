import { eq } from 'drizzle-orm';
import type db from '@/db';
import * as schema from '@/db/schema';
import roles from './data/roles.json';

// console.log('Creating roles ...');
// const adminRole = await db
// 		.insert(schema.roles)
// 		.values([{ name: 'admin' }])
// 		.onConflictDoNothing()
// 		.returning();
// const userRole = await db
// 		.insert(schema.roles)
// 		.values([{ name: 'user' }])
// 		.onConflictDoNothing()
// 		.returning();
// await db
// 		.insert(schema.roles)
// 		.values([{ name: 'editor' }])
// 		.onConflictDoNothing();
// await db
// 		.insert(schema.roles)
// 		.values([{ name: 'moderator' }])
// 		.onConflictDoNothing();
// console.log('Roles created.');

export default async function seed(db: db) {
	await db.insert(schema.roles).values({ name: 'user' });
	await db.insert(schema.roles).values({ name: 'admin' });
}
