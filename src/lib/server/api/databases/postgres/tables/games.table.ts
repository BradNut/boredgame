import {createId as cuid2} from '@paralleldrive/cuid2';
import {type InferSelectModel, relations, sql} from 'drizzle-orm';
import {index, integer, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core';
import {timestamps} from '../../../common/utils/table';
import {categories_to_games_table} from './categoriesToGames.table';
import {gamesToExternalIdsTable} from './gamesToExternalIds.table';
import {mechanics_to_games} from './mechanicsToGames.table';
import {publishers_to_games} from './publishersToGames.table';

export const gamesTable = pgTable(
	'games',
	{
		id: uuid().primaryKey().defaultRandom(),
		cuid: text()
			.unique()
			.$defaultFn(() => cuid2()),
		name: text().notNull(),
		slug: text().notNull(),
		description: text(),
		year_published: integer(),
		min_players: integer(),
		max_players: integer(),
		playtime: integer(),
		min_playtime: integer(),
		max_playtime: integer(),
		min_age: integer(),
		image_url: text(),
		thumb_url: text(),
		url: text(),
		last_sync_at: timestamp(),
		...timestamps,
	},
	(table) => ({
		searchIndex: index('search_index').using(
			'gin',
			sql`(
				setweight(to_tsvector('english', ${table.name}), 'A') ||
        setweight(to_tsvector('english', ${table.slug}), 'B')
      )`,
		),
	}),
);

export const gameRelations = relations(gamesTable, ({ many }) => ({
	categories_to_games: many(categories_to_games_table),
	mechanics_to_games: many(mechanics_to_games),
	publishers_to_games: many(publishers_to_games),
	gamesToExternalIds: many(gamesToExternalIdsTable),
}));

export type Games = InferSelectModel<typeof gamesTable>;
