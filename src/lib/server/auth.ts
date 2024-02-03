// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle";
import { dev } from '$app/environment';
import db from '$lib/drizzle';
import { sessionTable, userTable } from '../../schema';

const adapter = new DrizzleMySQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	getSessionAttributes: (attributes) => {
		return {
			ipCountry: attributes.ip_country,
			ipAddress: attributes.ip_address
		};
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			email: attributes.email,
			firstName: attributes.firstName,
			lastName: attributes.lastName,
			theme: attributes.theme
		};
	},
	sessionExpiresIn: new TimeSpan(30, "d"), // 30 days
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev,
			sameSite: 'strict',
			domain: dev ? 'localhost' : 'boredgame.vercel.app',
		}
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
	interface DatabaseSessionAttributes {
		ip_country: string;
		ip_address: string;
	}
	interface DatabaseUserAttributes {
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		theme: string;
	}
}
