import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_DB } from '$env/static/private';

console.log('DATABASE_URL', process.env.DATABASE_URL);

// create the connection
const connection = await mysql.createConnection({
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	host: DATABASE_HOST,
	port: 3306,
	database: DATABASE_DB
});

const db = drizzle(connection);

export default db;
