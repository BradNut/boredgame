import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import categoriesToExternalIds from './categoriesToExternalIds';
import categories_to_games from './categoriesToGames';
import { timestamps } from '../utils';

const categories = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	...timestamps,
});

export type Categories = InferSelectModel<typeof categories>;

export const categories_relations = relations(categories, ({ many }) => ({
	categories_to_games: many(categories_to_games),
	categoriesToExternalIds: many(categoriesToExternalIds),
}));

export default categories;
