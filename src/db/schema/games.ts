import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { tsvector } from '../../tsVector';
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
		name: text('name'),
		slug: text('slug'),
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
		text_searchable_index: tsvector('text_searchable_index'),
		last_sync_at: timestamp('last_sync_at', {
			withTimezone: true,
			mode: 'date',
			precision: 6,
		}),
		created_at: timestamp('created_at').notNull().defaultNow(),
		updated_at: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => {
		return {
			text_searchable_idx: index('text_searchable_idx')
				.on(table.text_searchable_index)
				.using(sql`'gin'`),
		};
	},
);

export const gameRelations = relations(games, ({ many }) => ({
	categories_to_games: many(categoriesToGames),
	mechanics_to_games: many(mechanicsToGames),
	publishers_to_games: many(publishersToGames),
	gamesToExternalIds: many(gamesToExternalIds),
}));

export type Games = InferSelectModel<typeof games>;

export default games;
