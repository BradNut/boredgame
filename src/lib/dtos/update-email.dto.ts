import { z } from "zod";

export const updateEmailDto = z.object({
	email: z
		.string()
		.trim()
		.max(64, {message: 'Email must be less than 64 characters'})
		.email({message: 'Please enter a valid email'})
});

export type UpdateEmailDto = z.infer<typeof updateEmailDto>;
