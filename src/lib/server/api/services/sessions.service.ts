import { SessionsRepository } from '$lib/server/api/repositories/sessions.repository';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { TimeSpan } from 'lucia';
import { inject, injectable } from 'tsyringe';
import type { Sessions, Users } from '../databases/postgres/tables';

export type SessionValidationResult = { session: Sessions; user: Users } | { session: null; user: null };

@injectable()
export class SessionsService {
	constructor(@inject(SessionsRepository) private readonly sessionsRepository: SessionsRepository) {}

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
		const session: Sessions = {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + new TimeSpan(2, 'w').seconds()),
			ipCountry,
			ipAddress,
			twoFactorAuthEnabled,
			isTwoFactorAuthenticated,
		};
		await this.sessionsRepository.create(session);
		return session;
	}

	async validateSessionToken(token: string): Promise<SessionValidationResult> {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const sessions = await this.sessionsRepository.findBySessionId(sessionId);
		if (sessions.length < 1) {
			return {
				session: null,
				user: null,
			};
		}
		const { user, session } = sessions[0];
		if (Date.now() >= session.expiresAt.getTime()) {
			await this.sessionsRepository.deleteBySessionId(sessionId);
			return {
				session: null,
				user: null,
			};
		}

		if (Date.now() >= session.expiresAt.getTime() - new TimeSpan(1, 'w').seconds()) {
			session.expiresAt = new Date(Date.now() + new TimeSpan(2, 'w').seconds());
			await this.sessionsRepository.updateSessionExpiresAt(sessionId, session.expiresAt);
		}

		return { session, user };
	}

	async invalidateSession(sessionId: string) {
		await this.sessionsRepository.deleteBySessionId(sessionId);
	}
}
