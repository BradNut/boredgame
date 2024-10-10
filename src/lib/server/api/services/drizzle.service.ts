import env from '$lib/server/api/common/env';
import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { type Disposable, injectable } from 'tsyringe';
import { config } from '../common/config';
import * as schema from '../databases/tables';

@injectable()
export class DrizzleService implements Disposable {
	protected readonly pool: pg.Pool;
	db: NodePgDatabase<typeof schema>;
	readonly schema: typeof schema = schema;

	constructor() {
		const pool = new pg.Pool({
			user: config.postgres.user,
			password: config.postgres.password,
			host: config.postgres.host,
			port: Number(config.postgres.port).valueOf(),
			database: config.postgres.database,
			ssl: config.postgres.ssl,
			max: config.postgres.max,
		});
		this.pool = pool;
		this.db = drizzle(pool, {
			schema,
			logger: env.NODE_ENV === 'development',
		});
	}

	dispose(): Promise<void> | void {
		this.pool.end();
	}
}
