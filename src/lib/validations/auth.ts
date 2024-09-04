import { refinePasswords } from './account';
import { userSchema } from './zod-schemas';
import { z } from 'zod';

export const signUpSchema = userSchema
	.pick({
		firstName: true,
		lastName: true,
		email: true,
		username: true,
		password: true,
		confirm_password: true,
	})
	.superRefine(async ({ confirm_password, password }, ctx) => {
		return await refinePasswords(confirm_password, password, ctx);
	});

export const signInSchema = z.object({
	username: z
		.string()
		.trim()
		.min(3, { message: 'Must be at least 3 characters' })
		.max(50, { message: 'Must be less than 50 characters' }),
	password: z.string({ required_error: 'Password is required' }).trim(),
});

export const totpSchema = z.object({
	totpToken: z.string().trim().min(6).max(6),
});

export const recoveryCodeSchema = z.object({
	recoveryCode: z.string().trim().min(10).max(10),
});

export const resetPasswordEmailSchema = z.object({
	email: z.string().trim().max(64, { message: 'Email must be less than 64 characters' }),
});

export const resetPasswordTokenSchema = z.object({
	resetToken: z.string().trim().min(6).max(6),
});