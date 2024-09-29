import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table.utils'
import { usersTable } from './users.table'

export const collections = pgTable('collections', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: text('name').notNull().default('My Collection'),
	...timestamps,
})

export const collection_relations = relations(collections, ({ one }) => ({
	user: one(usersTable, {
		fields: [collections.user_id],
		references: [usersTable.id],
	}),
}))

export type Collections = InferSelectModel<typeof collections>
