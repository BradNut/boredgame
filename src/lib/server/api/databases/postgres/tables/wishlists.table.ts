import {createId as cuid2} from '@paralleldrive/cuid2';
import {type InferSelectModel, relations} from 'drizzle-orm';
import {pgTable, text, uuid} from 'drizzle-orm/pg-core';
import {timestamps} from '../../../common/utils/table';
import {usersTable} from './users.table';

export const wishlistsTable = pgTable('wishlists', {
	id: uuid().primaryKey().defaultRandom(),
	cuid: text()
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid()
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: text().notNull().default('My Wishlist'),
	...timestamps,
});

export type Wishlists = InferSelectModel<typeof wishlistsTable>;

export const wishlists_relations = relations(wishlistsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [wishlistsTable.user_id],
		references: [usersTable.id],
	}),
}));
