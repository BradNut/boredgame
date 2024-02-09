import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from 'drizzle-orm';
import pg from 'pg';
import * as schema from '../schema';

// create the connection
const pool = new pg.Pool({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	database: process.env.DATABASE_DB
});

const db = drizzle(pool, { schema: schema });

const existingRoles = await db.query.roles.findMany();
if (existingRoles.length === 0) {
	console.log('Creating roles ...');
	await db.insert(schema.roles).values([{
		name: 'admin'
	}, {
		name: 'user'
	}]);
	console.log('Roles created.');
} else {
	console.log('Roles already exist. No action taken.');
}

const indexes = await db.execute(sql`select * from pg_catalog.pg_indexes where tablename = 'games'`);

console.log('Indexes', indexes);

const nameSlugIndexExists = indexes[0].flatMap((i) => i.Key_name).indexOf('full_text_name_slug_index') > -1;

console.log('nameSlugIndexExists', nameSlugIndexExists);

if (!nameSlugIndexExists) {
	console.log('Full Text Index does not exist. Creating...');
	// Create index
	await db.execute(sql`alter table games ADD FULLTEXT INDEX full_text_name_slug_index (name, slug)`);
} else {
	console.log('Full Text Index already exists. No action taken.');
}

await connection.end();
