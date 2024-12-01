import { ConfigService } from '$lib/server/api/common/configs/config.service';
import { inject, injectable } from '@needle-di/core';
import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './tables';

@injectable()
export class DrizzleService {
  pool: pg.Pool;
  db: NodePgDatabase<typeof schema>;
  readonly schema: typeof schema = schema;

  constructor(private configService = inject(ConfigService)) {
    const pool = new pg.Pool({
      user: this.configService.envs.DATABASE_USER,
      password: this.configService.envs.DATABASE_PASSWORD,
      host: this.configService.envs.DATABASE_HOST,
      port: Number(this.configService.envs.DATABASE_PORT).valueOf(),
      database: this.configService.envs.DATABASE_DB,
      ssl: false,
      max: this.configService.envs.DB_MIGRATING || this.configService.envs.DB_SEEDING ? 1 : undefined,
    });
    this.pool = pool;
    this.db = drizzle({
      client: pool,
      casing: 'snake_case',
      schema,
      logger: this.configService.envs.ENV !== 'prod',
    });
  }
}
