import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {
	DATABASE_USER,
	DATABASE_PASSWORD,
	DATABASE_HOST,
	DATABASE_DB,
	DATABASE_PORT
} from '$env/static/private';
import * as schema from '../schema';

// create the connection
const pool = new pg.Pool({
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	host: DATABASE_HOST,
	port: Number(DATABASE_PORT).valueOf(),
	database: DATABASE_DB
});

const db = drizzle(pool, { schema });

export default db;
