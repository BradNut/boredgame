import env from './env';
import type { Config } from './types/config';

export const config: Config = {
	isProduction: env.NODE_ENV === 'production',
	domain: env.DOMAIN,
	api: {
		origin: env.ORIGIN,
	},
	redis: {
		url: env.REDIS_URL,
	},
	postgres: {
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		host: env.DATABASE_HOST,
		port: env.DATABASE_PORT,
		database: env.DATABASE_DB,
		ssl: false, // env.DATABASE_HOST !== 'localhost',
		max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
	},
};
