import { createId as cuid2 } from '@paralleldrive/cuid2'
import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { usersTable } from './users.table'

export const password_reset_tokens = pgTable('password_reset_tokens', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expires_at: timestamp('expires_at'),
	...timestamps,
})

export type PasswordResetTokensTable = InferSelectModel<typeof password_reset_tokens>

export const password_reset_token_relations = relations(password_reset_tokens, ({ one }) => ({
	user: one(usersTable, {
		fields: [password_reset_tokens.user_id],
		references: [usersTable.id],
	}),
}))
