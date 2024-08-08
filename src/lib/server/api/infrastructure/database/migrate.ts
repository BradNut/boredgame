import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import env from '../../../../../env';
import config from '../../../../../../drizzle.config';

const connection = postgres({
	host: env.DATABASE_HOST || 'localhost',
	port: env.DATABASE_PORT,
	user: env.DATABASE_USER || 'root',
	password: env.DATABASE_PASSWORD || '',
	database: env.DATABASE_DB || 'boredgame',
	ssl: env.NODE_ENV === 'development' ? false : 'require',
	max: 1,
});
const db = drizzle(connection);

try {
	await migrate(db, { migrationsFolder: config.out! });
	console.log('Migrations complete');
} catch (e) {
	console.error(e);
}

process.exit();
