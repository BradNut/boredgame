import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { gamesTable } from '././games.table'
import { externalIdsTable } from './externalIds.table'

export const gamesToExternalIdsTable = pgTable(
	'games_to_external_ids',
	{
		gameId: uuid('game_id')
			.notNull()
			.references(() => gamesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIdsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			gamesToExternalIdsPkey: primaryKey({
				columns: [table.gameId, table.externalId],
			}),
		}
	},
)