import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2';
import * as schema from '../schema';

const connection = createConnection({
	host: process.env.DATABASE_HOST,
	port: 3306,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DB
});
const db = drizzle(connection, { schema: schema, mode: 'default' });

const existingRoles = await db.query.roles.findMany();
if (existingRoles.length === 0) {
	await db.insert(schema.roles).values([{
		name: 'admin'
	}, {
		name: 'user'
	}]);
	console.log('Roles created.');
} else {
	console.log('Roles already exist. No action taken.');
}

await connection.end();
