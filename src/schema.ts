import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import mysql from "mysql2/promise";
import { int, mysqlEnum, mysqlTable, uniqueIndex, datetime, varchar, serial } from 'drizzle-orm/mysql-core';
import { drizzle } from "drizzle-orm/mysql2";

const connection = await mysql.createConnection();
const db = drizzle(connection);

const userTable = mysqlTable("user", {
	id: varchar("id", {
		length: 255
	}).primaryKey()
});

const sessionTable = mysqlTable("session", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 255
	})
		.notNull()
		.references(() => userTable.id),
	expiresAt: datetime("expires_at").notNull()
});

const adapter = new DrizzleMySQLAdapter(db, sessionTable, userTable);
