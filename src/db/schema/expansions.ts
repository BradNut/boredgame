import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import games from './games';

export const expansions = pgTable('expansions', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	base_game_id: uuid('base_game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	game_id: uuid('game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type Expansions = InferSelectModel<typeof expansions>;

export const expansion_relations = relations(expansions, ({ one }) => ({
	baseGame: one(games, {
		fields: [expansions.base_game_id],
		references: [games.id],
	}),
	game: one(games, {
		fields: [expansions.game_id],
		references: [games.id],
	}),
}));
