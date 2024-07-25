import { Table, getTableName, sql } from 'drizzle-orm';
import env from '../env';
import { db, pool } from '$db';
import * as schema from './tables';
import * as seeds from './seeds';

if (!env.DB_SEEDING) {
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
	schema.sessionsTable,
	schema.userRoles,
	schema.usersTable,
	schema.twoFactor,
	schema.wishlists,
	schema.wishlist_items,
]) {
	// await db.delete(table); // clear tables without truncating / resetting ids
	await resetTable(db, table);
}

await seeds.roles(db);
await seeds.users(db);

await pool.end();
process.exit();
