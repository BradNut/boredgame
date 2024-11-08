import {type InferSelectModel, relations} from 'drizzle-orm';
import {boolean, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core';
import {cuid2} from '../../../common/utils/table';
import {usersTable} from './users.table';

export const sessionsTable = pgTable('sessions', {
	id: cuid2().primaryKey(),
	userId: uuid()
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	expiresAt: timestamp({
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	ipCountry: text(),
	ipAddress: text(),
	twoFactorAuthEnabled: boolean().default(false),
	isTwoFactorAuthenticated: boolean().default(false),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id],
	}),
}));

export type Sessions = InferSelectModel<typeof sessionsTable>;
