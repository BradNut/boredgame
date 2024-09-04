import { timestamps } from '$lib/server/api/common/utils/table.utils'
import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { user_roles } from './userRoles'

export const roles = pgTable('roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2())
		.notNull(),
	name: text('name').unique().notNull(),
	...timestamps,
})

export type Roles = InferSelectModel<typeof roles>

export const role_relations = relations(roles, ({ many }) => ({
	user_roles: many(user_roles),
}))
