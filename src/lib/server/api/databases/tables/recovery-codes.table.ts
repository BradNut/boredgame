import type { InferSelectModel } from 'drizzle-orm'
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { usersTable } from './users.table'

export const recoveryCodesTable = pgTable('recovery_codes', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id),
	code: text('code').notNull(),
	used: boolean('used').default(false),
	...timestamps,
})

export type RecoveryCodesTable = InferSelectModel<typeof recoveryCodesTable>
