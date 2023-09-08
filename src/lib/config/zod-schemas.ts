import { z } from 'zod';

export type ListGame = {
	id: string;
	game_name: string;
	game_id: string;
	collection_id: string;
	wishlist_id: string;
	times_played: number;
	thumb_url: string | null;
	in_collection: boolean;
	in_wishlist: boolean;
};

export const modifyListGameSchema = z.object({
	id: z.string()
});

export type ModifyListGame = typeof modifyListGameSchema;

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
	confirm_password: z
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

export const signUpSchema = userSchema
	.pick({
		firstName: true,
		lastName: true,
		email: true,
		username: true,
		password: true,
		confirm_password: true,
		terms: true
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			// ctx.addIssue({
			// 	code: 'custom',
			// 	message: 'Password and Confirm Password must match',
			// 	path: ['password']
			// });
			ctx.addIssue({
				code: 'custom',
				message: ' Password and Confirm Password must match',
				path: ['confirm_password']
			});
		}
	});

export const signInSchema = userSchema.pick({
	username: true,
	password: true
});

export const updateUserPasswordSchema = userSchema
	.pick({ password: true, confirm_password: true })
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirm_password']
			});
		}
	});
