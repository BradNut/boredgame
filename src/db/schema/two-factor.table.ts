import { createId as cuid2 } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils';
import users from './users';

const twoFactorTable = pgTable('two_factor', {
	id: uuid('id')
		.primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	two_factor_secret: text('two_factor_secret').notNull(),
	two_factor_enabled: boolean('two_factor_enabled').notNull().default(false),
	initiated_time: timestamp('initiated_time', {
		mode: 'date',
		withTimezone: true,
	}).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id)
		.unique(),
	...timestamps,
});

export const emailVerificationsRelations = relations(twoFactorTable, ({ one }) => ({
	user: one(users, {
		fields: [twoFactorTable.userId],
		references: [users.id],
	}),
}));

export type TwoFactor = InferSelectModel<typeof twoFactorTable>;

export default twoFactorTable;