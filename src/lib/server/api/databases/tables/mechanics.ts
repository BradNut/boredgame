import { timestamps } from '../../common/utils/table.utils'
import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { mechanicsToExternalIds } from './mechanicsToExternalIds'
import { mechanics_to_games } from './mechanicsToGames'

export const mechanics = pgTable('mechanics', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	...timestamps,
})

export type Mechanics = InferSelectModel<typeof mechanics>

export const mechanics_relations = relations(mechanics, ({ many }) => ({
	mechanics_to_games: many(mechanics_to_games),
	mechanicsToExternalIds: many(mechanicsToExternalIds),
}))
