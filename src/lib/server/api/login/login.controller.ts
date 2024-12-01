import { limiter } from '$lib/server/api/common/middleware/rate-limit.middleware';
import { Controller } from '$lib/server/api/common/types/controller';
import { cookieExpiresAt, createSessionTokenCookie, setSessionCookie } from '$lib/server/api/common/utils/cookies';
import { signinUsernameDto } from '$lib/server/api/dtos/signin-username.dto';
import { SessionsService } from '$lib/server/api/iam/sessions/sessions.service';
import { zValidator } from '@hono/zod-validator';
import { inject, injectable } from '@needle-di/core';
import { openApi } from 'hono-zod-openapi';
import { signinUsername } from './login.routes';
import { LoginRequestsService } from './loginrequest.service';

@injectable()
export class LoginController extends Controller {
  constructor(
    private loginRequestsService = inject(LoginRequestsService),
    private sessionsService = inject(SessionsService),
  ) {
    super();
  }

  routes() {
    return this.controller.post(
      '/',
      openApi(signinUsername),
      zValidator('json', signinUsernameDto),
      limiter({ limit: 10, minutes: 60 }),
      async (c) => {
        const { username, password } = c.req.valid('json');
        const session = await this.loginRequestsService.verify({ username, password }, c.req);
        const sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
        console.log('set cookie', sessionCookie);
        setSessionCookie(c, sessionCookie);
        return c.json({ message: 'ok' });
      },
    );
  }
}
