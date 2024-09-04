import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia'
import { config } from '../configs/config'
import { sessionsTable, usersTable } from '../databases/tables'
import { db } from './drizzle'

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable)

export const lucia = new Lucia(adapter, {
	getSessionAttributes: (attributes) => {
		return {
			ipCountry: attributes.ip_country,
			ipAddress: attributes.ip_address,
			isTwoFactorAuthEnabled: attributes.twoFactorAuthEnabled,
			isTwoFactorAuthenticated: attributes.isTwoFactorAuthenticated,
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// ...attributes,
			username: attributes.username,
			email: attributes.email,
			firstName: attributes.first_name,
			lastName: attributes.last_name,
			mfa_enabled: attributes.mfa_enabled,
			theme: attributes.theme,
		}
	},
	sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
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
})

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
		DatabaseSessionAttributes: DatabaseSessionAttributes
	}
	interface DatabaseSessionAttributes {
		ip_country: string
		ip_address: string
		twoFactorAuthEnabled: boolean
		isTwoFactorAuthenticated: boolean
	}
	interface DatabaseUserAttributes {
		username: string
		email: string
		first_name: string
		last_name: string
		mfa_enabled: boolean
		theme: string
	}
}
