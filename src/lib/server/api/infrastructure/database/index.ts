import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { config } from '../../common/config';
import * as schema from './tables';

// create the connection
export const pool = new pg.Pool({
	user: config.DATABASE_USER,
	password: config.DATABASE_PASSWORD,
	host: config.DATABASE_HOST,
	port: Number(config.DATABASE_PORT).valueOf(),
	database: config.DATABASE_DB,
	ssl: config.DATABASE_HOST !== 'localhost',
	max: config.DB_MIGRATING || config.DB_SEEDING ? 1 : undefined,
});

export const db = drizzle(pool, {
	schema,
	logger: config.NODE_ENV === 'development',
});

export type db = typeof db;
