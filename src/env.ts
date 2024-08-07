import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

const stringBoolean = z.coerce
	.string()
	.transform((val) => {
		return val === 'true';
	})
	.default('false');

const EnvSchema = z.object({
	NODE_ENV: z.string().default('development'),
	DATABASE_USER: z.string(),
	DATABASE_PASSWORD: z.string(),
	DATABASE_HOST: z.string(),
	DATABASE_PORT: z.coerce.number(),
	DATABASE_DB: z.string(),
	DATABASE_URL: z.string(),
	PUBLIC_SITE_NAME: z.string(),
	PUBLIC_SITE_URL: z.string(),
	PUBLIC_UMAMI_DO_NOT_TRACK: z.string(),
	PUBLIC_UMAMI_ID: z.string(),
	PUBLIC_UMAMI_URL: z.string(),
	DB_MIGRATING: stringBoolean,
	DB_SEEDING: stringBoolean,
	ADMIN_USERNAME: z.string(),
	ADMIN_PASSWORD: z.string(),
	TWO_FACTOR_TIMEOUT: z.coerce.number().default(300000),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config());

try {
	EnvSchema.parse(process.env);
} catch (error) {
	if (error instanceof ZodError) {
		let message = 'Missing required values in .env:\n';
		error.issues.forEach((issue) => {
			message += issue.path[0] + '\n';
		});
		const e = new Error(message);
		e.stack = '';
		throw e;
	} else {
		console.error(error);
	}
}

export default EnvSchema.parse(process.env);
