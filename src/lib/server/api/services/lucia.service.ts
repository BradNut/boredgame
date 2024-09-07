import { config } from '$lib/server/api/common/config'
import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { Lucia, TimeSpan } from 'lucia'
import { inject, injectable } from 'tsyringe'

@injectable()
export class LuciaService {
	readonly lucia: Lucia
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {
		const adapter = new DrizzlePostgreSQLAdapter(this.drizzle.db, this.drizzle.schema.sessionsTable, this.drizzle.schema.usersTable)
		this.lucia = new Lucia(adapter, {
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
		})
	}
}
