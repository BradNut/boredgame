import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {publishers} from './publishers';
import {games} from './games';

export const publishers_to_games = pgTable(
	'publishers_to_games',
	{
		publisher_id: uuid('publisher_id')
			.notNull()
			.references(() => publishers.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			publishersToGamesPkey: primaryKey({
				columns: [table.publisher_id, table.game_id],
			}),
		};
	},
);

export const publishers_to_games_relations = relations(publishers_to_games, ({ one }) => ({
	publisher: one(publishers, {
		fields: [publishers_to_games.publisher_id],
		references: [publishers.id],
	}),
	game: one(games, {
		fields: [publishers_to_games.game_id],
		references: [games.id],
	}),
}));
