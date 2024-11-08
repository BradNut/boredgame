import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { timestamps } from '../../../common/utils/table';
import { user_roles } from './userRoles.table';

export const usersTable = pgTable('users', {
	id: uuid().primaryKey().defaultRandom(),
	cuid: text()
		.unique()
		.$defaultFn(() => cuid2()),
	username: text().unique(),
	email: text().unique(),
	first_name: text(),
	last_name: text(),
	verified: boolean().default(false),
	receive_email: boolean().default(false),
	email_verified: boolean().default(false),
	picture: text(),
	mfa_enabled: boolean().notNull().default(false),
	theme: text().default('system'),
	...timestamps,
});

export const userRelations = relations(usersTable, ({ many }) => ({
	user_roles: many(user_roles),
}));

export const selectUserSchema = createSelectSchema(usersTable);

export type Users = InferSelectModel<typeof usersTable>;
