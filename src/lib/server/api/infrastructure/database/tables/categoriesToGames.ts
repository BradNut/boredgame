import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categoriesTable } from './categories.table';
import games from './games';

export const categories_to_games_table = pgTable(
	'categories_to_games',
	{
		category_id: uuid('category_id')
			.notNull()
			.references(() => categoriesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
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

export const categories_to_games_relations = relations(categories_to_games_table, ({ one }) => ({
	category: one(categoriesTable, {
		fields: [categories_to_games_table.category_id],
		references: [categoriesTable.id],
	}),
	game: one(games, {
		fields: [categories_to_games_table.game_id],
		references: [games.id],
	}),
}));

