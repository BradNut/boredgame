// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from '$lib/drizzle';
import { sessions, users } from '../../schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

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
	sessionExpiresIn: new TimeSpan(30, 'd'), // 30 days
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			domain:
				process.env.NODE_ENV === 'production'
					? process.env.VERCEL_URL ?? 'boredgame.vercel.app'
					: 'localhost'
		}
	}
});

declare module 'lucia' {
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
