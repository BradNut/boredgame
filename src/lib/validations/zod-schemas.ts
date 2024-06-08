import { z } from 'zod';
import { IntegerString } from '$lib/zodValidation';

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
	id: z.string(),
});

export type ModifyListGame = typeof modifyListGameSchema;

export const userSchema = z.object({
	firstName: z.string().trim().optional(),
	lastName: z.string().trim().optional(),
	email: z.string().trim().max(64, { message: 'Email must be less than 64 characters' }).optional(),
	username: z
		.string()
		.trim()
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(50, { message: 'Username must be less than 50 characters' }),
	password: z.string({ required_error: 'Password is required' }).trim(),
	confirm_password: z.string({ required_error: 'Confirm Password is required' }).trim(),
	verified: z.boolean().default(false),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(false),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const PaginationSchema = z.object({
	skip: z.number().min(0).default(0),
	limit: z.number().min(10).max(100).default(10),
});

export type PaginationSchema = typeof PaginationSchema;

export const FilterSchema = z.object({
	status: z.string(),
	author: z.string(),
});

export type FilterSchema = typeof FilterSchema;

export const SortSchema = z
	.object({
		sort: z.string(),
		order: z.enum(['asc', 'desc']).default('asc'),
		minAge: IntegerString(z.number().min(1).max(120).optional()),
		minPlayers: IntegerString(z.number().min(1).max(50).optional()),
		maxPlayers: IntegerString(z.number().min(1).max(50).optional()),
	})
	.superRefine(({ minPlayers, maxPlayers }, ctx) => {
		console.log({ minPlayers, maxPlayers });
		if (minPlayers && maxPlayers && minPlayers > maxPlayers) {
			ctx.addIssue({
				code: 'custom',
				message: 'Min Players must be smaller than Max Players',
				path: ['minPlayers'],
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Min Players must be smaller than Max Players',
				path: ['maxPlayers'],
			});
		}
	});

export const SearchSchema = z.object({
	q: z.string(),
	exact: z.preprocess((a) => Boolean(a), z.boolean().default(true)),
});

export type SearchSchema = typeof SearchSchema;
