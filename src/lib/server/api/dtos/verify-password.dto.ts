import { z } from 'zod'

export const verifyPasswordDto = z.object({
	password: z.string({ required_error: 'Password is required' }).trim(),
})

export type VerifyPasswordDto = z.infer<typeof verifyPasswordDto>
