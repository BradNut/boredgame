import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import categories from './categories';
import games from './games';

const categories_to_games = pgTable(
	'categories_to_games',
	{
		category_id: uuid('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			categoriesToGamesPkey: primaryKey({
				columns: [table.category_id, table.game_id],
			}),
		};
	},
);

export const categories_to_games_relations = relations(categories_to_games, ({ one }) => ({
	category: one(categories, {
		fields: [categories_to_games.category_id],
		references: [categories.id],
	}),
	game: one(games, {
		fields: [categories_to_games.game_id],
		references: [games.id],
	}),
}));

export default categories_to_games;
