import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../../common/utils/table';
import { usersTable } from './users.table';

export const federatedIdentityTable = pgTable('federated_identity', {
	id: uuid().primaryKey().defaultRandom(),
	user_id: uuid()
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	identity_provider: text().notNull(),
	federated_user_id: text().notNull(),
	federated_username: text().notNull(),
	...timestamps,
});

export type FederatedIdentity = InferSelectModel<typeof federatedIdentityTable>;
