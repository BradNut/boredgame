import 'reflect-metadata'
import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type Table, getTableName, sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import env from '../../../../env'
import * as seeds from './seeds'
import * as schema from './tables'

const drizzleService = new DrizzleService()

if (!env.DB_SEEDING) {
	throw new Error('You must set DB_SEEDING to "true" when running seeds')
}

async function resetTable(db: NodePgDatabase<typeof schema>, table: Table) {
	return db.execute(sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`))
}

for (const table of [
	schema.categoriesTable,
	schema.categoriesToExternalIdsTable,
	schema.categories_to_games_table,
	schema.collection_items,
	schema.collections,
	schema.credentialsTable,
	schema.expansionsTable,
	schema.externalIdsTable,
	schema.federatedIdentityTable,
	schema.gamesTable,
	schema.gamesToExternalIdsTable,
	schema.mechanicsTable,
	schema.mechanicsToExternalIdsTable,
	schema.mechanics_to_games,
	schema.password_reset_tokens,
	schema.publishersTable,
	schema.publishersToExternalIdsTable,
	schema.publishers_to_games,
	schema.recoveryCodesTable,
	schema.rolesTable,
	schema.sessionsTable,
	schema.twoFactorTable,
	schema.user_roles,
	schema.usersTable,
	schema.wishlist_items,
	schema.wishlistsTable,
]) {
	// await db.delete(table); // clear tables without truncating / resetting ids
	await resetTable(drizzleService.db, table)
}

await seeds.roles(drizzleService.db)
await seeds.users(drizzleService.db)

await drizzleService.dispose()
process.exit()
