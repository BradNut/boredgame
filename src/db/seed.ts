import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import { Argon2id } from 'oslo/password';

// create the connection
const pool = new pg.Pool({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT).valueOf(),
	database: process.env.DATABASE_DB,
	ssl: process.env.DATABASE_HOST !== 'localhost',
});

const db = drizzle(pool, { schema: schema });

console.log('Creating roles ...');
const adminRole = await db
	.insert(schema.roles)
	.values([{ name: 'admin' }])
	.onConflictDoNothing()
	.returning();
const userRole = await db
	.insert(schema.roles)
	.values([{ name: 'user' }])
	.onConflictDoNothing()
	.returning();
await db
	.insert(schema.roles)
	.values([{ name: 'editor' }])
	.onConflictDoNothing();
await db
	.insert(schema.roles)
	.values([{ name: 'moderator' }])
	.onConflictDoNothing();
console.log('Roles created.');

console.log('Admin Role: ', adminRole);

const adminUser = await db
	.insert(schema.users)
	.values({
		username: `${process.env.ADMIN_USERNAME}`,
		email: '',
		hashed_password: await new Argon2id().hash(`${process.env.ADMIN_PASSWORD}`),
		first_name: 'Brad',
		last_name: 'S',
		verified: true,
	})
	.returning()
	.onConflictDoNothing();

console.log('Admin user created.', adminUser);

await db
	.insert(schema.user_roles)
	.values({
		user_id: adminUser[0].id,
		role_id: adminRole[0].id,
	})
	.onConflictDoNothing();

console.log('Admin user given admin role.');

await db
	.insert(schema.user_roles)
	.values({
		user_id: adminUser[0].id,
		role_id: userRole[0].id,
	})
	.onConflictDoNothing();

console.log('Admin user given user role.');

await pool.end();
process.exit();
