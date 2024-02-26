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
	email: z.string()
		.trim()
		.max(64, { message: 'Email must be less than 64 characters' })
		.email({ message: 'Please enter a valid email address' })
		.optional(),
	username: z
		.string()
		.trim()
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(50, { message: 'Username must be less than 50 characters' }),
	password: z
		.string({ required_error: 'Password is required' })
		.trim(),
	confirm_password: z
		.string({ required_error: 'Confirm Password is required' })
		.trim(),
	verified: z.boolean().default(false),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(false),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});
