import { ConfigService } from '$lib/server/api/common/configs/config.service';
import { RequestContextService } from '$lib/server/api/common/services/request-context.service';
import { generateId } from '$lib/server/api/common/utils/crypto';
import type { CreateSessionDto } from '$lib/server/api/iam/sessions/dtos/create-session-dto';
import type { SessionDto } from '$lib/server/api/iam/sessions/dtos/session.dto';
import { SessionsRepository } from '$lib/server/api/iam/sessions/sessions.repository';
import { UsersService } from '$lib/server/api/users/users.service';
import { inject, injectable } from '@needle-di/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie';

dayjs.extend(relativeTime);

@injectable()
export class SessionsService {
  private readonly sessionCookieName = 'session';

  constructor(
    private sessionsRepository = inject(SessionsRepository),
    private requestContextService = inject(RequestContextService),
    private configService = inject(ConfigService),
    private usersService = inject(UsersService),
  ) {}

  setSessionCookie(session: SessionDto) {
    return setSignedCookie(this.requestContextService.getContext(), this.sessionCookieName, session.id, this.configService.envs.SIGNING_SECRET, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.envs.ENV === 'prod',
      path: '/',
      expires: session.expiresAt,
    });
  }

  async getSessionCookie(): Promise<string | null> {
    const session = await getSignedCookie(this.requestContextService.getContext(), this.configService.envs.SIGNING_SECRET, this.sessionCookieName);
    if (!session) return null;
    return session;
  }

  deleteSessionCookie() {
    return deleteCookie(this.requestContextService.getContext(), this.sessionCookieName);
  }

  async createSession(userId: string, twoFactorVerified = false, ipCountry = 'unknown', ipAddress = 'unknown'): Promise<SessionDto> {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new Error('User not found');

    const session: CreateSessionDto = {
      id: this.generateSessionToken(),
      userId,
      createdAt: dayjs().toDate(),
      expiresAt: dayjs().add(30, 'day').toDate(),
      ipCountry,
      ipAddress,
      twoFactorEnabled: user.mfa_enabled,
      twoFactorVerified,
    };

    await this.sessionsRepository.create(session);
    return { ...session, fresh: true };
  }

  async validateSession(sessionId: string): Promise<SessionDto | null> {
    // Check if session exists
    const existingSession = await this.sessionsRepository.get(sessionId);

    // If session does not exist, return null
    if (!existingSession) return null;

    // If session exists, check if it should be extended
    const shouldExtendSession = dayjs(existingSession.expiresAt).diff(Date.now(), 'day') < 15;

    // If session should be extended, update the session in the database
    if (shouldExtendSession) {
      existingSession.expiresAt = dayjs().add(30, 'day').toDate();
      await this.sessionsRepository.create({ ...existingSession });
      return { ...existingSession, fresh: true };
    }

    return { ...existingSession, fresh: false };
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionsRepository.delete(sessionId);
  }

  private generateSessionToken(): string {
    return generateId();
  }
}
