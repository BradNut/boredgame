import { z } from 'zod'

export const addTwoFactorSchema = z.object({
	password: z.string({ required_error: 'Current Password is required' }),
	two_factor_code: z.string({ required_error: 'Two Factor Code is required' }).trim(),
})

export type AddTwoFactorSchema = typeof addTwoFactorSchema

export const removeTwoFactorSchema = addTwoFactorSchema.pick({
	password: true,
})

export type RemoveTwoFactorSchema = typeof removeTwoFactorSchema
