import 'dotenv/config';
import postgres from 'postgres';
import config from '../../drizzle.config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const connection = postgres({
	host: process.env.DATABASE_HOST || 'localhost',
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER || 'root',
	password: process.env.DATABASE_PASSWORD || '',
	database: process.env.DATABASE_DB || 'boredgame',
	ssl: process.env.NODE_ENV === 'development' ? false : 'require',
	max: 1,
});
const db = drizzle(connection);

try {
	await migrate(db, { migrationsFolder: config.out! });
	console.log('Migrations complete');
} catch (e) {
	console.error(e);
}

// await connection.end();
process.exit();
