import { z } from "zod";

export const verifyTotpDto = z.object({
	code: z
		.string()
		.trim()
		.min(6, { message: 'Must be at least 6 characters' })
		.max(6, { message: 'Must be less than 6 characters' }),
});

export type VerifyTotpDto = z.infer<typeof verifyTotpDto>;