import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../../common/utils/table';
import { usersTable } from './users.table';

export const twoFactorTable = pgTable('two_factor', {
	id: uuid().primaryKey().defaultRandom(),
	cuid: text()
		.unique()
		.$defaultFn(() => cuid2()),
	secret: text().notNull(),
	enabled: boolean().notNull().default(false),
	initiatedTime: timestamp({
		mode: 'date',
		withTimezone: true,
	}),
	userId: uuid()
		.notNull()
		.references(() => usersTable.id)
		.unique('two_factor_user_id_unique'),
	...timestamps,
});

export const emailVerificationsRelations = relations(twoFactorTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [twoFactorTable.userId],
		references: [usersTable.id],
	}),
}));

export type TwoFactor = InferSelectModel<typeof twoFactorTable>;
