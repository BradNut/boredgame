import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import wishlists from './wishlists';
import games from './games';
import { timestamps } from '../utils';

const wishlist_items = pgTable('wishlist_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	wishlist_id: uuid('wishlist_id')
		.notNull()
		.references(() => wishlists.id, { onDelete: 'cascade' }),
	game_id: uuid('game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	...timestamps,
});

export type WishlistItems = InferSelectModel<typeof wishlist_items>;

export const wishlist_item_relations = relations(wishlist_items, ({ one }) => ({
	wishlist: one(wishlists, {
		fields: [wishlist_items.wishlist_id],
		references: [wishlists.id],
	}),
	game: one(games, {
		fields: [wishlist_items.game_id],
		references: [games.id],
	}),
}));

export default wishlist_items;
