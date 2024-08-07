import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import { usersTable } from './users.table';
import {roles} from './roles';
import { timestamps } from '../utils';

export const user_roles = pgTable('user_roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	role_id: uuid('role_id')
		.notNull()
		.references(() => roles.id, { onDelete: 'cascade' }),
	primary: boolean('primary').default(false),
	...timestamps,
});

export const user_role_relations = relations(user_roles, ({ one }) => ({
	role: one(roles, {
		fields: [user_roles.role_id],
		references: [roles.id],
	}),
	user: one(usersTable, {
		fields: [user_roles.user_id],
		references: [usersTable.id],
	}),
}));

export type UserRoles = InferSelectModel<typeof user_roles>;
