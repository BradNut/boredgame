import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { createConnection } from 'mysql2';

const connection = createConnection({
	host: process.env.DATABASE_HOST,
	port: 3306,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DB
});
const db = drizzle(connection);

await migrate(db, { migrationsFolder: 'drizzle' });

await connection.end();
