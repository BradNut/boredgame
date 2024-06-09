import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations, sql } from 'drizzle-orm';
import categoriesToGames from './categoriesToGames';
import gamesToExternalIds from './gamesToExternalIds';
import mechanicsToGames from './mechanicsToGames';
import publishersToGames from './publishersToGames';

const games = pgTable(
	'games',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		cuid: text('cuid')
			.unique()
			.$defaultFn(() => cuid2()),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		description: text('description'),
		year_published: integer('year_published'),
		min_players: integer('min_players'),
		max_players: integer('max_players'),
		playtime: integer('playtime'),
		min_playtime: integer('min_playtime'),
		max_playtime: integer('max_playtime'),
		min_age: integer('min_age'),
		image_url: text('image_url'),
		thumb_url: text('thumb_url'),
		url: text('url'),
		last_sync_at: timestamp('last_sync_at'),
		created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
		updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
	},
	(table) => ({
    searchIndex: index('search_index').using(
      'gin',
      sql`(
        setweight(to_tsvector('english', ${table.name}), 'A') ||
        setweight(to_tsvector('english', ${table.slug}), 'B')
      )`
    ),
  })
);

export const gameRelations = relations(games, ({ many }) => ({
	categories_to_games: many(categoriesToGames),
	mechanics_to_games: many(mechanicsToGames),
	publishers_to_games: many(publishersToGames),
	gamesToExternalIds: many(gamesToExternalIds),
}));

export type Games = InferSelectModel<typeof games>;

export default games;
