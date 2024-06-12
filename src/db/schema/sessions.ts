import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { type InferSelectModel } from 'drizzle-orm';
import users from './users';

const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	ipCountry: text('ip_country'),
	ipAddress: text('ip_address'),
	twoFactorAuthEnabled: boolean('two_factor_auth_enabled').default(false),
	isTwoFactorAuthenticated: boolean('is_two_factor_authenticated').default(false),
});

export type Sessions = InferSelectModel<typeof sessions>;

export default sessions;
