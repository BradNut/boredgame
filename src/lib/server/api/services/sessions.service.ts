import { cookieExpiresAt, cookieExpiresMilliseconds, halfCookieExpiresMilliseconds } from '$lib/server/api/common/utils/cookies';
import { UsersRepository } from '$lib/server/api/repositories/users.repository';
import { RedisService } from '$lib/server/api/services/redis.service';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { inject, injectable } from 'tsyringe';
import type { Users } from '../databases/postgres/tables';

export type RedisSession = {
	id: string;
	user_id: string;
	expires_at: number;
	ip_country: string;
	ip_address: string;
	two_factor_auth_enabled: boolean;
	is_two_factor_authenticated: boolean;
};

export type Session = {
	id: string;
	userId: string;
	expiresAt: Date;
	ipCountry: string;
	ipAddress: string;
	twoFactorAuthEnabled: boolean;
	isTwoFactorAuthenticated: boolean;
};

export type SessionValidationResult = { session: Session; user: Users } | { session: null; user: null } | { session: Session; user: null };

@injectable()
export class SessionsService {
	constructor(
		@inject(RedisService) private readonly redisService: RedisService,
		@inject(UsersRepository) private readonly usersRepository: UsersRepository,
	) {}

	generateSessionToken() {
		const bytes = new Uint8Array(20);
		crypto.getRandomValues(bytes);
		return encodeBase32LowerCaseNoPadding(bytes);
	}

	async createSession(
		token: string,
		userId: string,
		ipCountry: string,
		ipAddress: string,
		twoFactorAuthEnabled: boolean,
		isTwoFactorAuthenticated: boolean,
	) {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const session = {
			id: sessionId,
			userId,
			expiresAt: cookieExpiresAt,
			ipCountry,
			ipAddress,
			twoFactorAuthEnabled,
			isTwoFactorAuthenticated,
		};
		await this.redisService.client.set(
			`session:${sessionId}`,
			JSON.stringify({
				id: session.id,
				user_id: session.userId,
				expires_at: session.expiresAt,
				ip_country: session.ipCountry,
				ip_address: session.ipAddress,
				two_factor_auth_enabled: session.twoFactorAuthEnabled,
				is_two_factor_authenticated: session.isTwoFactorAuthenticated,
			}),
			'EXAT',
			Math.floor(session.expiresAt.getTime() / 1000),
		);
		return session;
	}

	async validateSessionToken(token: string): Promise<SessionValidationResult> {
		// TODO: Why was this needed in the docs? https://lucia-next.pages.dev/sessions/basic-api/drizzle-orm
		// const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const item = await this.redisService.client.get(`session:${token}`);
		if (item === null) {
			return {
				session: null,
				user: null,
			};
		}
		const result: RedisSession = JSON.parse(item);
		const session: Session = {
			id: result.id,
			userId: result.user_id,
			expiresAt: new Date(result.expires_at * 1000),
			ipCountry: result.ip_country,
			ipAddress: result.ip_address,
			twoFactorAuthEnabled: result.two_factor_auth_enabled,
			isTwoFactorAuthenticated: result.is_two_factor_authenticated,
		};
		let user: Users | undefined = undefined;
		if (session.userId && session.userId !== 'anonymous') {
			user = await this.usersRepository.findOneById(session.userId);
		}
		if (Date.now() >= session.expiresAt.getTime()) {
			await this.redisService.client.del(`session:${token}`);
			return {
				session: null,
				user: null,
			};
		}

		if (Date.now() >= session.expiresAt.getTime() - cookieExpiresMilliseconds) {
			session.expiresAt = new Date(Date.now() + halfCookieExpiresMilliseconds);
			await this.redisService.client.set(
				`session:${token}`,
				JSON.stringify({
					id: session.id,
					user_id: session.userId,
					expires_at: Math.floor(session.expiresAt.getTime() / 1000),
					ip_country: session.ipCountry,
					ip_address: session.ipAddress,
					two_factor_auth_enabled: session.twoFactorAuthEnabled,
					is_two_factor_authenticated: session.isTwoFactorAuthenticated,
				}),
				'EXAT',
				Math.floor(session.expiresAt.getTime() / 1000),
			);
		}

		return { session, user: user ?? null };
	}

	async invalidateSession(sessionId: string) {
		await this.redisService.client.del(`session:${sessionId}`);
	}
}
