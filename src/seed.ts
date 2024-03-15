import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

// create the connection
const pool = new pg.Pool({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: new Number(process.env.DATABASE_PORT).valueOf(),
	database: process.env.DATABASE_DB,
	ssl: process.env.DATABASE_HOST === 'localhost' ? false : true
});

const db = drizzle(pool, { schema: schema });

const existingRoles = await db.query.roles.findMany();
console.log('Existing roles', existingRoles);
console.log('Creating roles ...');
await db
	.insert(schema.roles)
	.values([{ name: 'admin' }])
	.onConflictDoNothing();
await db
	.insert(schema.roles)
	.values([{ name: 'user' }])
	.onConflictDoNothing();
await db
	.insert(schema.roles)
	.values([{ name: 'editor' }])
	.onConflictDoNothing();
console.log('Roles created.');
await db
	.insert(schema.roles)
	.values([{ name: 'moderator' }])
	.onConflictDoNothing();
console.log('Roles created.');

await pool.end();
process.exit();
