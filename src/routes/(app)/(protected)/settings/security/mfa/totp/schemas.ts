import { z } from 'zod';

export const addTwoFactorSchema = z.object({
	password: z.string({ required_error: 'Current Password is required' }),
	code: z.string({ required_error: 'Two Factor Code is required' }).trim(),
	key: z.string({ required_error: 'Secret Data is required' }).length(28).trim(),
});

export type AddTwoFactorSchema = typeof addTwoFactorSchema;

export const removeTwoFactorSchema = addTwoFactorSchema.pick({
	password: true,
});

export type RemoveTwoFactorSchema = typeof removeTwoFactorSchema;
