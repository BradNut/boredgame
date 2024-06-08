import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';
import users from './users';

const recovery_codes = pgTable('recovery_codes', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	code: text('code').notNull(),
	used: boolean('used').default(false),
	created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export type RecoveryCodes = InferSelectModel<typeof recovery_codes>;

export default recovery_codes;
