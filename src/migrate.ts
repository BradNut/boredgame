import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const connection = postgres({
	host: process.env.DATABASE_HOST,
	port: 3306,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DB,
	ssl: 'require',
	max: 1
});
const db = drizzle(connection);

try {
	await migrate(db, { migrationsFolder: 'drizzle' });
	console.log('Migrations complete');
} catch (e) {
	console.error(e);
}

await connection.end();
process.exit();
