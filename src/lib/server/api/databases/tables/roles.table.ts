import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { user_roles } from './userRoles.table'

export const rolesTable = pgTable('roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2())
		.notNull(),
	name: text('name').unique().notNull(),
	...timestamps,
})

export type Roles = InferSelectModel<typeof rolesTable>

export const role_relations = relations(rolesTable, ({ many }) => ({
	user_roles: many(user_roles),
}))
