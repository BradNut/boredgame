import env from './env'
import type { Config } from './types/config'

const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development'

let domain: string
if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
	domain = 'boredgame.vercel.app'
} else if (isPreview && process.env.VERCEL_BRANCH_URL !== undefined) {
	domain = process.env.VERCEL_BRANCH_URL
} else {
	domain = 'localhost'
}

// export const config = { ...env, isProduction: process.env.NODE_ENV === 'production'
// 			|| process.env.VERCEL_ENV === 'production', domain };

export const config: Config = {
	isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production',
	domain,
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
}
