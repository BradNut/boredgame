import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connection = postgres({
	host: process.env.DATABASE_HOST,
	port: 3306,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DB
});
const db = drizzle(connection);

await migrate(db, { migrationsFolder: 'drizzle' });

await connection.end();
