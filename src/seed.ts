import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg';
import * as schema from './schema';

// create the connection
const pool = new pg.Pool({
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	host: process.env.DATABASE_HOST,
	port: new Number(process.env.DATABASE_PORT).valueOf(),
	database: process.env.DATABASE_DB
});

const db = drizzle(pool, { schema: schema });

const existingRoles = await db.query.roles.findMany();
console.log('Existing roles', existingRoles);
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
