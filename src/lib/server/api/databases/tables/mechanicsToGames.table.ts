import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { gamesTable } from '././games.table'
import { mechanicsTable } from './mechanics.table'

export const mechanics_to_games = pgTable(
	'mechanics_to_games',
	{
		mechanic_id: uuid('mechanic_id')
			.notNull()
			.references(() => mechanicsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => gamesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			mechanicsToGamesPkey: primaryKey({
				columns: [table.mechanic_id, table.game_id],
			}),
		}
	},
)

export const mechanics_to_games_relations = relations(mechanics_to_games, ({ one }) => ({
	mechanic: one(mechanicsTable, {
		fields: [mechanics_to_games.mechanic_id],
		references: [mechanicsTable.id],
	}),
	game: one(gamesTable, {
		fields: [mechanics_to_games.game_id],
		references: [gamesTable.id],
	}),
}))
