import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import mechanicsToGames from './mechanicsToGames';
import mechanicsToExternalIds from './mechanicsToExternalIds';

const mechanics = pgTable('mechanics', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export type Mechanics = InferSelectModel<typeof mechanics>;

export const mechanics_relations = relations(mechanics, ({ many }) => ({
	mechanics_to_games: many(mechanicsToGames),
	mechanicsToExternalIds: many(mechanicsToExternalIds),
}));

export default mechanics;
