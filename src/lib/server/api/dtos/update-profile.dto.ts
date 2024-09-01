import { z } from "zod";

export const updateProfileDto = z.object({
	firstName: z
		.string()
		.trim()
		.min(3, {message: 'Must be at least 3 characters'})
		.max(50, {message: 'Must be less than 50 characters'})
		.optional(),
	lastName: z
		.string()
		.trim()
		.min(3, {message: 'Must be at least 3 characters'})
		.max(50, {message: 'Must be less than 50 characters'})
		.optional(),
	username: z
		.string()
		.trim()
		.min(3, {message: 'Must be at least 3 characters'})
		.max(50, {message: 'Must be less than 50 characters'})
});

export type UpdateProfileDto = z.infer<typeof updateProfileDto>;
