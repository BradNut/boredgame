import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_DB } from '$env/static/private';
import * as schema from '../schema';

// create the connection
const connection = await mysql.createConnection({
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	host: DATABASE_HOST,
	port: 3306,
	database: DATABASE_DB
});

const db = drizzle(connection, { schema: schema, mode: 'default' });

export default db;
