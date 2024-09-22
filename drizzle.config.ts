import 'dotenv/config'
import env from './src/lib/server/api/common/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	out: './src/lib/server/api/databases/migrations',
	schema: './src/lib/server/api/databases/tables/*.table.ts',
	dbCredentials: {
		host: env.DATABASE_HOST || 'localhost',
		port: Number(env.DATABASE_PORT) || 5432,
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		database: env.DATABASE_DB || 'boredgame',
		ssl: env.DATABASE_HOST !== 'localhost',
	},
	// Print all statements
	verbose: true,
	// Always as for confirmation
	strict: true,
	migrations: {
		table: 'migrations',
		schema: 'public',
	},
})
