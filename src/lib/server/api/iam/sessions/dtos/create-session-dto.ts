import { z } from 'zod';

export const createSessionDto = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date({ coerce: true }),
  expiresAt: z.date({ coerce: true }),
  ipCountry: z.string(),
  ipAddress: z.string(),
  twoFactorEnabled: z.boolean(),
  twoFactorVerified: z.boolean(),
});

export type CreateSessionDto = z.infer<typeof createSessionDto>;
