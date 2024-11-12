import {drizzle, type NodePgDatabase} from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {type Disposable, injectable} from '@needle-di/core';
import {config} from '../common/config';
import * as schema from '../databases/postgres/tables';

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
		this.db = drizzle({
			client: pool,
			casing: 'snake_case',
			schema,
			logger: !config.isProduction,
		});
	}

	dispose(): Promise<void> | void {
		this.pool.end();
	}
}
