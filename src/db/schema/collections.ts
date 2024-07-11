import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import users from './users';
import { timestamps } from '../utils';

const collections = pgTable('collections', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull().default('My Collection'),
	...timestamps,
});

export const collection_relations = relations(collections, ({ one }) => ({
	user: one(users, {
		fields: [collections.user_id],
		references: [users.id],
	}),
}));

export type Collections = InferSelectModel<typeof collections>;

export default collections;
