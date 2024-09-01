import { collections } from '$lib/server/api/databases/tables'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'

export const InsertCollectionSchema = createInsertSchema(collections, {
	name: (schema) =>
		schema.name.trim().min(3, { message: 'Must be at least 3 characters' }).max(64, { message: 'Must be less than 64 characters' }).optional(),
}).omit({
	id: true,
	cuid: true,
	createdAt: true,
	updatedAt: true,
})

export type InsertCollectionSchema = z.infer<typeof InsertCollectionSchema>

export const SelectCollectionSchema = createSelectSchema(collections).omit({
	id: true,
	user_id: true,
	createdAt: true,
	updatedAt: true,
})

export type SelectUserSchema = z.infer<typeof SelectCollectionSchema>
