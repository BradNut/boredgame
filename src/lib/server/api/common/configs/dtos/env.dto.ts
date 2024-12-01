import { z } from 'zod';

const stringBoolean = z.coerce
  .string()
  .transform((val) => {
    return val === 'true';
  })
  .default('false');

export const envsDto = z.object({
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_DB: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
  DOMAIN: z.string(),
  ENCRYPTION_KEY: z.string(),
  ENV: z.enum(['dev', 'prod']),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  NODE_ENV: z.string().default('development'),
  ORIGIN: z.string(),
  PORT: z.number({ coerce: true }).default(5173),
  PUBLIC_SITE_NAME: z.string(),
  PUBLIC_SITE_URL: z.string(),
  PUBLIC_UMAMI_DO_NOT_TRACK: z.string().default('true'),
  PUBLIC_UMAMI_ID: z.string(),
  PUBLIC_UMAMI_URL: z.string(),
  REDIS_URL: z.string(),
  SIGNING_SECRET: z.string(),
  TWO_FACTOR_TIMEOUT: z.coerce.number().default(300000),
});

export type EnvsDto = z.infer<typeof envsDto>;
