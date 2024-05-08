import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
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
});

export default sessions;
