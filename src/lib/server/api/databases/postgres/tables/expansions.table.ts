import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../../common/utils/table';
import { gamesTable } from './games.table';

export const expansionsTable = pgTable('expansions', {
	id: uuid().primaryKey().defaultRandom(),
	cuid: text()
		.unique()
		.$defaultFn(() => cuid2()),
	base_game_id: uuid()
		.notNull()
		.references(() => gamesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	game_id: uuid()
		.notNull()
		.references(() => gamesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	...timestamps,
});

export type Expansions = InferSelectModel<typeof expansionsTable>;

export const expansion_relations = relations(expansionsTable, ({ one }) => ({
	baseGame: one(gamesTable, {
		fields: [expansionsTable.base_game_id],
		references: [gamesTable.id],
	}),
	game: one(gamesTable, {
		fields: [expansionsTable.game_id],
		references: [gamesTable.id],
	}),
}));
