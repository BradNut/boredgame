// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from '$db/index';
import { sessionsTable, usersTable } from '$db/schema';
import { config } from '../../common/config';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	getSessionAttributes: (attributes) => {
		return {
			ipCountry: attributes.ip_country,
			ipAddress: attributes.ip_address,
			isTwoFactorAuthEnabled: attributes.twoFactorAuthEnabled,
			isTwoFactorAuthenticated: attributes.isTwoFactorAuthenticated,
		};
	},
	getUserAttributes: (attributes) => {
		return {
			...attributes,
		};
	},
	sessionExpiresIn: new TimeSpan(30, 'd'), // 30 days
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			// set to `true` when using HTTPS
			secure: config.isProduction,
			sameSite: 'strict',
			domain: config.domain,
		},
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
	interface DatabaseSessionAttributes {
		ip_country: string;
		ip_address: string;
		twoFactorAuthEnabled: boolean;
		isTwoFactorAuthenticated: boolean;
	}
	interface DatabaseUserAttributes {
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		theme: string;
	}
}
