import { z } from "zod";
import { refinePasswords } from "$lib/validations/account";

export const signupUsernameEmailDto = z.object({
	firstName: z.string().trim().optional(),
	lastName: z.string().trim().optional(),
	email: z.string()
			.trim()
			.max(64, {message: 'Email must be less than 64 characters'})
			.email({message: 'Please enter a valid email'})
			.optional(),
	username: z
			.string()
			.trim()
			.min(3, {message: 'Must be at least 3 characters'})
			.max(50, {message: 'Must be less than 50 characters'}),
	password: z.string({required_error: 'Password is required'}).trim(),
	confirm_password: z.string({required_error: 'Confirm Password is required'}).trim()
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		return refinePasswords(confirm_password, password, ctx);
	});

export type SignupUsernameEmailDto = z.infer<typeof signupUsernameEmailDto>
