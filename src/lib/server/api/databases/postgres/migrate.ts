import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import config from '../../../../../../drizzle.config';
import env from '../../common/env';
import { DrizzleService } from '../../services/drizzle.service';

const drizzleService = new DrizzleService();

if (!config.out) {
	console.error('No migrations folder specified in drizzle.config.ts');
	process.exit();
}
if (!env.DB_MIGRATING) {
	throw new Error('You must set DB_MIGRATING to "true" when running migrations.');
}
await migrate(drizzleService.db, { migrationsFolder: config.out });
console.log('Migrations complete');

await drizzleService.dispose();
process.exit();
