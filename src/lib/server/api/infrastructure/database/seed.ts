import { Table, getTableName, sql } from 'drizzle-orm';
import env from '../../../../../env';
import { db, pool } from './index';
import * as schema from './tables';
import * as seeds from './seeds';

if (!env.DB_SEEDING) {
	throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
	return db.execute(sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`));
}

for (const table of [
	schema.categoriesTable,
	schema.categoriesToExternalIdsTable,
	schema.categories_to_games_table,
	schema.collection_items,
	schema.collections,
	schema.credentialsTable,
	schema.expansions,
	schema.externalIds,
	schema.federatedIdentityTable,
	schema.games,
	schema.gamesToExternalIds,
	schema.mechanics,
	schema.mechanicsToExternalIds,
	schema.mechanics_to_games,
	schema.password_reset_tokens,
	schema.publishers,
	schema.publishersToExternalIds,
	schema.publishers_to_games,
	schema.recoveryCodesTable,
	schema.roles,
	schema.sessionsTable,
	schema.twoFactorTable,
	schema.user_roles,
	schema.usersTable,
	schema.wishlist_items,
	schema.wishlists,
]) {
	// await db.delete(table); // clear tables without truncating / resetting ids
	await resetTable(db, table);
}

await seeds.roles(db);
await seeds.users(db);

await pool.end();
process.exit();
