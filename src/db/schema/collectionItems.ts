import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import collections from './collections';
import games from './games';
import { timestamps } from '../utils';

const collection_items = pgTable('collection_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	collection_id: uuid('collection_id')
		.notNull()
		.references(() => collections.id, { onDelete: 'cascade' }),
	game_id: uuid('game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	times_played: integer('times_played').default(0),
	...timestamps,
});

export type CollectionItems = InferSelectModel<typeof collection_items>;

export const collection_item_relations = relations(collection_items, ({ one }) => ({
	collection: one(collections, {
		fields: [collection_items.collection_id],
		references: [collections.id],
	}),
	game: one(games, {
		fields: [collection_items.game_id],
		references: [games.id],
	}),
}));

export default collection_items;
