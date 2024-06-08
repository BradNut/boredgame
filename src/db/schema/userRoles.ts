import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import users from './users';
import roles from './roles';

const user_roles = pgTable('user_roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	role_id: uuid('role_id')
		.notNull()
		.references(() => roles.id, { onDelete: 'cascade' }),
	primary: boolean('primary').default(false),
	created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const user_role_relations = relations(user_roles, ({ one }) => ({
	role: one(roles, {
		fields: [user_roles.role_id],
		references: [roles.id],
	}),
	user: one(users, {
		fields: [user_roles.user_id],
		references: [users.id],
	}),
}));

export type UserRoles = InferSelectModel<typeof user_roles>;

export default user_roles;
