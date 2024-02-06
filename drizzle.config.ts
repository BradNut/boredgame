import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/schema.ts',
	out: './drizzle',
	driver: 'mysql2',
	dbCredentials: {
		host: process.env.DATABASE_HOST || 'localhost',
		port: 3306,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE || 'nut-shells'
	}
});