import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { rolesTable } from './roles.table'
import { usersTable } from './users.table'

export const user_roles = pgTable('user_roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	role_id: uuid('role_id')
		.notNull()
		.references(() => rolesTable.id, { onDelete: 'cascade' }),
	primary: boolean('primary').default(false),
	...timestamps,
})

export const user_role_relations = relations(user_roles, ({ one }) => ({
	role: one(rolesTable, {
		fields: [user_roles.role_id],
		references: [rolesTable.id],
	}),
	user: one(usersTable, {
		fields: [user_roles.user_id],
		references: [usersTable.id],
	}),
}))

export type UserRolesTable = InferSelectModel<typeof user_roles>
