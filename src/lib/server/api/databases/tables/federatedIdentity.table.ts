import { type InferSelectModel } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../common/utils/table'
import { usersTable } from './users.table'

export const federatedIdentityTable = pgTable('federated_identity', {
	id: uuid('id').primaryKey().defaultRandom(),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	identity_provider: text('identity_provider').notNull(),
	federated_user_id: text('federated_user_id').notNull(),
	federated_username: text('federated_username').notNull(),
	...timestamps,
})

export type FederatedIdentity = InferSelectModel<typeof federatedIdentityTable>
