import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { usersTable } from '$lib/server/api/infrastructure/database/tables'

export const InsertUserSchema = createInsertSchema(usersTable, {
	email: (schema) => schema.email.max(64).email().optional(),
	username: (schema) =>
		schema.username.min(3, { message: 'Must be at least 3 characters' }).max(50, { message: 'Must be less than 50 characters' }).optional(),
	first_name: (schema) =>
		schema.first_name.trim().min(3, { message: 'Must be at least 3 characters' }).max(64, { message: 'Must be less than 64 characters' }).optional(),
	last_name: (schema) =>
		schema.last_name.trim().min(3, { message: 'Must be at least 3 characters' }).max(64, { message: 'Must be less than 64 characters' }).optional(),
}).omit({
	id: true,
	cuid: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertUserSchema = z.infer<typeof InsertUserSchema>

export const SelectUserSchema = createSelectSchema(usersTable)

export type SelectUserSchema = z.infer<typeof SelectUserSchema>
