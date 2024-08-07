import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { usersTable } from './users.table';

export const sessionsTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	ipCountry: text('ip_country'),
	ipAddress: text('ip_address'),
	twoFactorAuthEnabled: boolean('two_factor_auth_enabled').default(false),
	isTwoFactorAuthenticated: boolean('is_two_factor_authenticated').default(false),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id],
	})
}));

export type Sessions = InferSelectModel<typeof sessionsTable>;
