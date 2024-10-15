import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { timestamps } from '../../common/utils/table';
import { collection_items } from './collectionItems.table';
import { usersTable } from './users.table';

export const collections = pgTable('collections', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull().default('My Collection'),
	...timestamps,
});

export const collection_relations = relations(collections, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [collections.user_id],
		references: [usersTable.id],
	}),
	collection_items: many(collection_items),
}));

export const selectCollectionSchema = createSelectSchema(collections);

export type Collections = InferSelectModel<typeof collections>;
