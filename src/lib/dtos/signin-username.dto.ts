import { z } from "zod";

export const signinUsernameDto = z.object({
	username: z
		.string()
		.trim()
		.min(3, { message: 'Must be at least 3 characters' })
		.max(50, { message: 'Must be less than 50 characters' }),
	password: z.string({ required_error: 'Password is required' }).trim(),
});

export type SigninUsernameDto = z.infer<typeof signinUsernameDto>;