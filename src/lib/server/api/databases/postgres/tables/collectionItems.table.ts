import {createId as cuid2} from '@paralleldrive/cuid2';
import {type InferSelectModel, relations} from 'drizzle-orm';
import {integer, pgTable, text, uuid} from 'drizzle-orm/pg-core';
import {timestamps} from '../../../common/utils/table';
import {collections} from './collections.table';
import {gamesTable} from './games.table';

export const collection_items = pgTable('collection_items', {
	id: uuid().primaryKey().defaultRandom(),
	cuid: text()
		.unique()
		.$defaultFn(() => cuid2()),
	collection_id: uuid()
		.notNull()
		.references(() => collections.id, { onDelete: 'cascade' }),
	game_id: uuid()
		.notNull()
		.references(() => gamesTable.id, { onDelete: 'cascade' }),
	times_played: integer().default(0),
	...timestamps,
});

export type CollectionItemsTable = InferSelectModel<typeof collection_items>;

export const collection_item_relations = relations(collection_items, ({ one }) => ({
	collection: one(collections, {
		fields: [collection_items.collection_id],
		references: [collections.id],
	}),
	game: one(gamesTable, {
		fields: [collection_items.game_id],
		references: [gamesTable.id],
	}),
}));
