import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import env from '../env';
import * as schema from './schema';

// create the connection
export const pool = new pg.Pool({
	user: env.DATABASE_USER,
	password: env.DATABASE_PASSWORD,
	host: env.DATABASE_HOST,
	port: Number(env.DATABASE_PORT).valueOf(),
	database: env.DATABASE_DB,
	ssl: env.DATABASE_HOST !== 'localhost',
	max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
});

export const db = drizzle(pool, {
	schema,
	logger: env.NODE_ENV === 'development',
});

export type db = typeof db;

export default db;
