import { config } from '$lib/server/api/configs/config'
import * as schema from '$lib/server/api/databases/tables'
import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { type Disposable, injectable } from 'tsyringe'

@injectable()
export class DrizzleService implements Disposable {
	protected readonly pool: pg.Pool
	readonly db: NodePgDatabase<typeof schema>
	readonly schema: typeof schema = schema

	constructor() {
		const pool = new pg.Pool({
			user: config.DATABASE_USER,
			password: config.DATABASE_PASSWORD,
			host: config.DATABASE_HOST,
			port: Number(config.DATABASE_PORT).valueOf(),
			database: config.DATABASE_DB,
			ssl: config.DATABASE_HOST !== 'localhost',
			max: config.DB_MIGRATING || config.DB_SEEDING ? 1 : undefined,
		})
		this.pool = pool
		this.db = drizzle(pool, {
			schema,
			logger: config.NODE_ENV === 'development',
		})
	}

	dispose(): Promise<void> | void {
		this.pool.end()
	}
}
