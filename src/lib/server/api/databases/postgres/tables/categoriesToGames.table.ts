import {relations} from 'drizzle-orm';
import {pgTable, primaryKey, uuid} from 'drizzle-orm/pg-core';
import {categoriesTable} from './categories.table';
import {gamesTable} from './games.table';

export const categories_to_games_table = pgTable(
	'categories_to_games',
	{
		category_id: uuid()
			.notNull()
			.references(() => categoriesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid()
			.notNull()
			.references(() => gamesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
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
	game: one(gamesTable, {
		fields: [categories_to_games_table.game_id],
		references: [gamesTable.id],
	}),
}));
