import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema/index.ts',
	out: './src/db/migrations',
	driver: 'pg',
	dbCredentials: {
		host: process.env.DATABASE_HOST || 'localhost',
		port: Number(process.env.DATABASE_PORT) || 5432,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE || 'boredgame',
		ssl: process.env.DATABASE_HOST !== 'localhost',
	},
	// Print all statements
	verbose: true,
	// Always as for confirmation
	strict: true,
});
