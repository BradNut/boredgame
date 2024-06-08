import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import users from './users';

const collections = pgTable('collections', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull().default('My Collection'),
	created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const collection_relations = relations(collections, ({ one }) => ({
	user: one(users, {
		fields: [collections.user_id],
		references: [users.id],
	}),
}));

export type Collections = InferSelectModel<typeof collections>;

export default collections;
