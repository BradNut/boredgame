import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import users from './users';

const wishlists = pgTable('wishlists', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	name: text('name').notNull().default('My Wishlist'),
	created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export type Wishlists = InferSelectModel<typeof wishlists>;

export const wishlists_relations = relations(wishlists, ({ one }) => ({
	user: one(users, {
		fields: [wishlists.user_id],
		references: [users.id],
	}),
}));

export default wishlists;
