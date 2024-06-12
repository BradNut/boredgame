import { Table, getTableName, sql } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { ADMIN_USERNAME, DB_SEEDING } from '$env/static/private';
import { db } from '../db';
import * as schema from './schema';
import * as seeds from './seeds';

if (!DB_SEEDING) {
	throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
	return db.execute(sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`));
}

for (const table of [
	schema.categories,
	schema.categoriesToExternalIds,
	schema.categories_to_games,
	schema.collection_items,
	schema.collections,
	schema.expansions,
	schema.externalIds,
	schema.games,
	schema.gamesToExternalIds,
	schema.mechanics,
	schema.mechanicsToExternalIds,
	schema.mechanics_to_games,
	schema.password_reset_tokens,
	schema.publishers,
	schema.publishersToExternalIds,
	schema.publishers_to_games,
	schema.recoveryCodes,
	schema.roles,
	schema.sessions,
	schema.userRoles,
	schema.users,
	schema.wishlists,
	schema.wishlist_items,
]) {
	// await db.delete(table); // clear tables without truncating / resetting ids
	await resetTable(db, table);
}

await seeds.roles(db);

await connection.end();

console.log('Creating roles ...');
const adminRole = await db
	.insert(schema.roles)
	.values([{ name: 'admin' }])
	.onConflictDoNothing()
	.returning();
const userRole = await db
	.insert(schema.roles)
	.values([{ name: 'user' }])
	.onConflictDoNothing()
	.returning();
await db
	.insert(schema.roles)
	.values([{ name: 'editor' }])
	.onConflictDoNothing();
await db
	.insert(schema.roles)
	.values([{ name: 'moderator' }])
	.onConflictDoNothing();
console.log('Roles created.');

console.log('Admin Role: ', adminRole);

const adminUser = await db
	.insert(schema.users)
	.values({
		username: `${ADMIN_USERNAME}`,
		email: '',
		hashed_password: await new Argon2id().hash(`${process.env.ADMIN_PASSWORD}`),
		first_name: 'Brad',
		last_name: 'S',
		verified: true,
	})
	.returning()
	.onConflictDoNothing();

console.log('Admin user created.', adminUser);

await db
	.insert(schema.user_roles)
	.values({
		user_id: adminUser[0].id,
		role_id: adminRole[0].id,
	})
	.onConflictDoNothing();

console.log('Admin user given admin role.');

await db
	.insert(schema.user_roles)
	.values({
		user_id: adminUser[0].id,
		role_id: userRole[0].id,
	})
	.onConflictDoNothing();

console.log('Admin user given user role.');

await pool.end();
process.exit();
