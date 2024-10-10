import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { type ZodError, z } from 'zod';

expand(config());

const stringBoolean = z.coerce
	.string()
	.transform((val) => {
		return val === 'true';
	})
	.default('false');

const EnvSchema = z.object({
	DATABASE_USER: z.string(),
	DATABASE_PASSWORD: z.string(),
	DATABASE_HOST: z.string(),
	DATABASE_PORT: z.coerce.number(),
	DATABASE_DB: z.string(),
	DB_MIGRATING: stringBoolean,
	DB_SEEDING: stringBoolean,
	DOMAIN: z.string(),
	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
	NODE_ENV: z.string().default('development'),
	ORIGIN: z.string(),
	PUBLIC_SITE_NAME: z.string(),
	PUBLIC_SITE_URL: z.string(),
	PUBLIC_UMAMI_DO_NOT_TRACK: z.string().default('true'),
	PUBLIC_UMAMI_ID: z.string(),
	PUBLIC_UMAMI_URL: z.string(),
	REDIS_URL: z.string(),
	TWO_FACTOR_TIMEOUT: z.coerce.number().default(300000),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
	env = EnvSchema.parse(process.env);
} catch (e) {
	const error = e as ZodError;
	console.error('❌ Missing required values in .env:\n');
	console.error(error.flatten().fieldErrors);
	process.exit(1);
}

export default env;
