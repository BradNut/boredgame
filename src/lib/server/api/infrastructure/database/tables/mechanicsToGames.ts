import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import mechanics from './mechanics';
import games from './games';

const mechanics_to_games = pgTable(
	'mechanics_to_games',
	{
		mechanic_id: uuid('mechanic_id')
			.notNull()
			.references(() => mechanics.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			mechanicsToGamesPkey: primaryKey({
				columns: [table.mechanic_id, table.game_id],
			}),
		};
	},
);

export const mechanics_to_games_relations = relations(mechanics_to_games, ({ one }) => ({
	mechanic: one(mechanics, {
		fields: [mechanics_to_games.mechanic_id],
		references: [mechanics.id],
	}),
	game: one(games, {
		fields: [mechanics_to_games.game_id],
		references: [games.id],
	}),
}));

export default mechanics_to_games;
