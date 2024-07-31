import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users.table";
import { timestamps } from '../utils';

export const federatedIdentityTable = pgTable('federated_identity', {
	id: uuid('id').primaryKey().defaultRandom(),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	idenitity_provider: text('idenitity_provider').notNull(),
	federated_user_id: text('federated_user_id').notNull(),
	federated_username: text('federated_username').notNull(),
	...timestamps
});