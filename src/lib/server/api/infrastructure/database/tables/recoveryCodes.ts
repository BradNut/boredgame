import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';
import { usersTable } from './users.table';
import { timestamps } from '../utils';

const recovery_codes = pgTable('recovery_codes', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id),
	code: text('code').notNull(),
	used: boolean('used').default(false),
	...timestamps,
});

export type RecoveryCodes = InferSelectModel<typeof recovery_codes>;

export default recovery_codes;
