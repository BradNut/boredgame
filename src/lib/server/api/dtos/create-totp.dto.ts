import { z } from 'zod';

export const createTwoFactorSchema = z.object({
  key: z.string({ required_error: 'Secret Data is required' }).length(28, { message: 'Secret Data must be 28 characters' }).trim(),
});

export type CreateTwoFactorDto = z.infer<typeof createTwoFactorSchema>;
