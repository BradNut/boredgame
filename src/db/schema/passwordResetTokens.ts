import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import users from './users';

const password_reset_tokens = pgTable('password_reset_tokens', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires_at: timestamp('expires_at'),
	created_at: timestamp('created_at').notNull().defaultNow(),
});

export type PasswordResetTokens = InferSelectModel<typeof password_reset_tokens>;

export const password_reset_token_relations = relations(password_reset_tokens, ({ one }) => ({
	user: one(users, {
		fields: [password_reset_tokens.user_id],
		references: [users.id],
	}),
}));

export default password_reset_tokens;
