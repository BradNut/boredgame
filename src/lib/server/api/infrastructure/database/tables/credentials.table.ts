import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from '../utils';
import { usersTable } from "./users.table";

export enum CredentialsType {
	SECRET = 'secret',
	PASSWORD = 'password',
	TOTP = 'totp',
	HOTP = 'hotp'
}

export const credentialsTable = pgTable('credentials', {
	id: uuid('id').primaryKey().defaultRandom(),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	type: text('type').notNull().default(CredentialsType.PASSWORD),
	secret_data: text('secret_data').notNull(),
	...timestamps
});