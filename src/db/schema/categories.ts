import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import categories_to_games from './categoriesToGames';

const categories = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type Categories = InferSelectModel<typeof categories>;

export const categories_relations = relations(categories, ({ many }) => ({
	categories_to_games: many(categories_to_games),
	categoriesToExternalIds: many(categoriesToExternalIds),
}));

export default categories;
