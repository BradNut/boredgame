import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import publishers_to_games from './publishersToGames';
import publishersToExternalIds from './publishersToExternalIds';

const publishers = pgTable('publishers', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type Publishers = InferSelectModel<typeof publishers>;

export const publishers_relations = relations(publishers, ({ many }) => ({
	publishers_to_games: many(publishers_to_games),
	publishersToExternalIds: many(publishersToExternalIds),
}));

export default publishers;
