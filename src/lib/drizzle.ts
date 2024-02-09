import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg';
import { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_DB } from '$env/static/private';
import * as schema from '../schema';

// create the connection
const pool = new pg.Pool({
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	host: DATABASE_HOST,
	port: 3306,
	database: DATABASE_DB
});

const db = drizzle(pool, { schema: schema });

export default db;
