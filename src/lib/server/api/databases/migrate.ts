import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import config from '../../../../../drizzle.config'
import env from '../common/env'

const connection = postgres({
	host: env.DATABASE_HOST || 'localhost',
	port: env.DATABASE_PORT,
	user: env.DATABASE_USER || 'root',
	password: env.DATABASE_PASSWORD || '',
	database: env.DATABASE_DB || 'boredgame',
	ssl: false, // env.NODE_ENV === 'development' ? false : 'require',
	max: 1,
})
const db = drizzle(connection)

try {
	if (!config.out) {
		console.error('No migrations folder specified in drizzle.config.ts')
		process.exit()
	}
	await migrate(db, { migrationsFolder: config.out })
	console.log('Migrations complete')
} catch (e) {
	console.error(e)
}

process.exit()
