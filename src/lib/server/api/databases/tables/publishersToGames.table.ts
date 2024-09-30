import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { gamesTable } from '././games.table'
import { publishersTable } from './publishers.table'

export const publishers_to_games = pgTable(
	'publishers_to_games',
	{
		publisher_id: uuid('publisher_id')
			.notNull()
			.references(() => publishersTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => gamesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			publishersToGamesPkey: primaryKey({
				columns: [table.publisher_id, table.game_id],
			}),
		}
	},
)

export const publishers_to_games_relations = relations(publishers_to_games, ({ one }) => ({
	publisher: one(publishersTable, {
		fields: [publishers_to_games.publisher_id],
		references: [publishersTable.id],
	}),
	game: one(gamesTable, {
		fields: [publishers_to_games.game_id],
		references: [gamesTable.id],
	}),
}))
