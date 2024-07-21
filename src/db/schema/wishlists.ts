import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import usersTable from './users.table';
import { timestamps } from '../utils';

const wishlists = pgTable('wishlists', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull().default('My Wishlist'),
	...timestamps,
});

export type Wishlists = InferSelectModel<typeof wishlists>;

export const wishlists_relations = relations(wishlists, ({ one }) => ({
	user: one(usersTable, {
		fields: [wishlists.user_id],
		references: [usersTable.id],
	}),
}));

export default wishlists;
