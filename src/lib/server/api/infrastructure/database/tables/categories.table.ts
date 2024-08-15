import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import {categoriesToExternalIdsTable} from './categoriesToExternalIdsTable';
import { categories_to_games_table } from './categoriesToGames';
import { timestamps } from '../utils';

export const categoriesTable = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	...timestamps,
});

export type Categories = InferSelectModel<typeof categoriesTable>;

export const categories_relations = relations(categoriesTable, ({ many }) => ({
	categories_to_games: many(categories_to_games_table),
	categoriesToExternalIds: many(categoriesToExternalIdsTable),
}));