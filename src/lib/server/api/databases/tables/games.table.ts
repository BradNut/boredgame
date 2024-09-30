import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations, sql } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { categories_to_games_table } from './categoriesToGames.table'
import { gamesToExternalIdsTable } from './gamesToExternalIds.table'
import { mechanics_to_games } from './mechanicsToGames.table'
import { publishers_to_games } from './publishersToGames.table'

export const gamesTable = pgTable(
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
)

export const gameRelations = relations(gamesTable, ({ many }) => ({
	categories_to_games: many(categories_to_games_table),
	mechanics_to_games: many(mechanics_to_games),
	publishers_to_games: many(publishers_to_games),
	gamesToExternalIds: many(gamesToExternalIdsTable),
}))

export type Games = InferSelectModel<typeof gamesTable>
