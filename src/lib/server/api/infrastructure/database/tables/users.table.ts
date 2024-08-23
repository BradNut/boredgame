import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { timestamps } from '../utils';
import {user_roles} from './userRoles';

export const usersTable = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	username: text('username').unique(),
	email: text('email').unique(),
	first_name: text('first_name'),
	last_name: text('last_name'),
	verified: boolean('verified').default(false),
	receive_email: boolean('receive_email').default(false),
	theme: text('theme').default('system'),
	...timestamps,
});

export const userRelations = relations(usersTable, ({ many }) => ({
	user_roles: many(user_roles),
}));

export type Users = InferSelectModel<typeof usersTable>;
