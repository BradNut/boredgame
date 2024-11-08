import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../../common/utils/table';
import { gamesTable } from './games.table';

export const expansions = pgTable('expansions', {
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

export type Expansions = InferSelectModel<typeof expansions>;

export const expansion_relations = relations(expansions, ({ one }) => ({
	baseGame: one(gamesTable, {
		fields: [expansions.base_game_id],
		references: [gamesTable.id],
	}),
	game: one(gamesTable, {
		fields: [expansions.game_id],
		references: [gamesTable.id],
	}),
}));
