import type {InferSelectModel} from 'drizzle-orm';
import {boolean, pgTable, text, uuid} from 'drizzle-orm/pg-core';
import {timestamps} from '../../../common/utils/table';
import {usersTable} from './users.table';

export const recoveryCodesTable = pgTable('recovery_codes', {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => usersTable.id),
	code: text().notNull(),
	used: boolean().default(false),
	...timestamps,
});

export type RecoveryCodesTable = InferSelectModel<typeof recoveryCodesTable>;
