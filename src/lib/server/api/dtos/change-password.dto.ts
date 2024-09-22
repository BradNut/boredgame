import { refinePasswords } from '$lib/validations/account'
import { z } from 'zod'

export const changePasswordDto = z
	.object({
		password: z.string({ required_error: 'Password is required' }).trim(),
		confirm_password: z
			.string({ required_error: 'Confirm Password is required' })
			.trim()
			.min(8, { message: 'Must be at least 8 characters' })
			.max(128, { message: 'Must be less than 128 characters' }),
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		return refinePasswords(confirm_password, password, ctx)
	})

export type ChangePasswordDto = z.infer<typeof changePasswordDto>
