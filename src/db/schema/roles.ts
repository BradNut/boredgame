import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { type InferSelectModel, relations } from 'drizzle-orm';
import user_roles from './userRoles';

const roles = pgTable('roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2())
		.notNull(),
	name: text('name').unique().notNull(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type Roles = InferSelectModel<typeof roles>;

export const role_relations = relations(roles, ({ many }) => ({
	user_roles: many(user_roles),
}));

export default roles;
