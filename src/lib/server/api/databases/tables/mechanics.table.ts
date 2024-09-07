import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { mechanicsToExternalIdsTable } from './mechanicsToExternalIds.table'
import { mechanics_to_games } from './mechanicsToGames.table'

export const mechanicsTable = pgTable('mechanics', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	...timestamps,
})

export type Mechanics = InferSelectModel<typeof mechanicsTable>

export const mechanics_relations = relations(mechanicsTable, ({ many }) => ({
	mechanics_to_games: many(mechanics_to_games),
	mechanicsToExternalIds: many(mechanicsToExternalIdsTable),
}))
