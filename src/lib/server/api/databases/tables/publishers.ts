import { timestamps } from '$lib/server/api/common/utils/table.utils'
import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { publishersToExternalIds } from './publishersToExternalIds'
import { publishers_to_games } from './publishersToGames'

export const publishers = pgTable('publishers', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	...timestamps,
})

export type Publishers = InferSelectModel<typeof publishers>

export const publishers_relations = relations(publishers, ({ many }) => ({
	publishers_to_games: many(publishers_to_games),
	publishersToExternalIds: many(publishersToExternalIds),
}))
