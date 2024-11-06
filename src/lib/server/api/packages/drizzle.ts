import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../common/config';
import * as schema from '../databases/postgres/tables';

// create the connection
export const pool = new Pool({
	user: config.postgres.user,
	password: config.postgres.password,
	host: config.postgres.host,
	port: Number(config.postgres.port).valueOf(),
	database: config.postgres.database,
	ssl: config.postgres.host !== 'localhost',
	max: config.postgres.migrating || config.postgres.seeding ? 1 : undefined,
});

export const db = drizzle({
	client: pool,
	casing: 'snake_case',
	schema,
	logger: !config.isProduction,
});

export type db = typeof db;
