import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { gamesTable } from '././games.table'
import { wishlistsTable } from './wishlists.table'

export const wishlist_items = pgTable('wishlist_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	wishlist_id: uuid('wishlist_id')
		.notNull()
		.references(() => wishlistsTable.id, { onDelete: 'cascade' }),
	game_id: uuid('game_id')
		.notNull()
		.references(() => gamesTable.id, { onDelete: 'cascade' }),
	...timestamps,
})

export type WishlistItemsTable = InferSelectModel<typeof wishlist_items>

export const wishlist_item_relations = relations(wishlist_items, ({ one }) => ({
	wishlist: one(wishlistsTable, {
		fields: [wishlist_items.wishlist_id],
		references: [wishlistsTable.id],
	}),
	game: one(gamesTable, {
		fields: [wishlist_items.game_id],
		references: [gamesTable.id],
	}),
}))
