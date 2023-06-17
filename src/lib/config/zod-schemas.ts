import { z } from 'zod';

export const userSchema = z.object({
	firstName: z.string().trim().optional(),
	lastName: z.string().trim().optional(),
	email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
	username: z
		.string()
		.trim()
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(50, { message: 'Username must be less than 50 characters' }),
	password: z
		.string({ required_error: 'Password is required' })
		.trim()
		.min(8, { message: 'Password must be at least 8 characters' })
		.max(128, { message: 'Password must be less than 128 characters' }),
	confirmPassword: z
		.string({ required_error: 'Confirm Password is required' })
		.trim()
		.min(8, { message: 'Confirm Password must be at least 8 characters' }),
	role: z.enum(['USER', 'ADMIN'], { required_error: 'You must have a role' }).default('USER'),
	verified: z.boolean().default(false),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(false),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});

export const updateUserPasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirmPassword']
			});
		}
	});
