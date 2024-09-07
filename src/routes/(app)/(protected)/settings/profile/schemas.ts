import { z } from 'zod'

export const updateEmailSchema = z.object({
	email: z.string().trim().max(64, { message: 'Email must be less than 64 characters' }).email({ message: 'Please enter a valid email' }),
})

export type UpdateEmailSchema = z.infer<typeof updateEmailSchema>

export const updateProfileSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(3, { message: 'Must be at least 3 characters' })
		.max(50, { message: 'Must be less than 50 characters' })
		.optional(),
	lastName: z.string().trim().min(3, { message: 'Must be at least 3 characters' }).max(50, { message: 'Must be less than 50 characters' }).optional(),
	username: z.string().trim().min(3, { message: 'Must be at least 3 characters' }).max(50, { message: 'Must be less than 50 characters' }),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
