import { timestamps } from '$lib/server/api/common/utils/table.utils'
import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './users.table'

export const twoFactorTable = pgTable('two_factor', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	secret: text('secret').notNull(),
	enabled: boolean('enabled').notNull().default(false),
	initiatedTime: timestamp('initiated_time', {
		mode: 'date',
		withTimezone: true,
	}),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id)
		.unique(),
	...timestamps,
})

export const emailVerificationsRelations = relations(twoFactorTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [twoFactorTable.userId],
		references: [usersTable.id],
	}),
}))

export type TwoFactor = InferSelectModel<typeof twoFactorTable>
