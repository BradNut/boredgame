import { StatusCodes } from '$lib/constants/status-codes';
import { Controller } from '$lib/server/api/common/types/controller';
import { createBlankSessionTokenCookie, setSessionCookie } from '$lib/server/api/common/utils/cookies';
import { changePasswordDto } from '$lib/server/api/dtos/change-password.dto';
import { updateEmailDto } from '$lib/server/api/dtos/update-email.dto';
import { updateProfileDto } from '$lib/server/api/dtos/update-profile.dto';
import { verifyPasswordDto } from '$lib/server/api/dtos/verify-password.dto';
import { limiter } from '$lib/server/api/middleware/rate-limiter.middleware';
import { IamService } from '$lib/server/api/services/iam.service';
import { LoginRequestsService } from '$lib/server/api/services/loginrequest.service';
import { SessionsService } from '$lib/server/api/services/sessions.service';
import { zValidator } from '@hono/zod-validator';
import { openApi } from 'hono-zod-openapi';
import { injectable, inject } from '@needle-di/core';
import { requireFullAuth, requireTempAuth } from '../middleware/require-auth.middleware';
import { iam, logout, updateEmail, updatePassword, updateProfile, verifyPassword } from './iam.routes';
import { UsersRepository } from '../repositories/users.repository';

@injectable()
export class IamController extends Controller {
  constructor(
    private iamService = inject(IamService),
    private loginRequestService = inject(LoginRequestsService),
    private sessionsService = inject(SessionsService),
    private usersRepository = inject(UsersRepository),
  ) {
    super();
  }

  routes() {
    return this.controller
      .get('/', openApi(iam), async (c) => {
        const session = c.var.session;
        const user = session ? await this.usersRepository.findOneByIdOrThrow(session.userId) : null;
        return c.json({ user, session });
      })
      .put(
        '/update/profile',
        requireFullAuth,
        openApi(updateProfile),
        zValidator('json', updateProfileDto),
        limiter({ limit: 30, minutes: 60 }),
        async (c) => {
          const user = c.var.user;
          const { firstName, lastName, username } = c.req.valid('json');
          const updatedUser = await this.iamService.updateProfile(user.id, { firstName, lastName, username });
          if (!updatedUser) {
            return c.json('Username already in use', StatusCodes.UNPROCESSABLE_ENTITY);
          }
          return c.json({ user: updatedUser }, StatusCodes.OK);
        },
      )
      .post(
        '/verify/password',
        requireFullAuth,
        zValidator('json', verifyPasswordDto),
        openApi(verifyPassword),
        limiter({ limit: 10, minutes: 60 }),
        async (c) => {
          const user = c.var.user;
          const { password } = c.req.valid('json');
          const passwordVerified = await this.iamService.verifyPassword(user.id, { password });
          if (!passwordVerified) {
            console.log('Incorrect password');
            return c.json('Incorrect password', StatusCodes.FORBIDDEN);
          }
          return c.json({}, StatusCodes.OK);
        },
      )
      .put(
        '/update/password',
        requireFullAuth,
        openApi(updatePassword),
        zValidator('json', changePasswordDto),
        limiter({ limit: 10, minutes: 60 }),
        async (c) => {
          const user = c.var.user;
          const { password, confirm_password } = c.req.valid('json');
          if (password !== confirm_password) {
            return c.json('Passwords do not match', StatusCodes.UNPROCESSABLE_ENTITY);
          }
          try {
            await this.iamService.updatePassword(user.id, { password, confirm_password });
            await this.sessionsService.invalidateSession(user.id);
            await this.loginRequestService.createUserSession(user.id, c.req, false, false);
            const sessionCookie = createBlankSessionTokenCookie();
            setSessionCookie(c, sessionCookie);
            return c.json({ status: 'success' });
          } catch (error) {
            console.error('Error updating password', error);
            return c.json('Error updating password', StatusCodes.INTERNAL_SERVER_ERROR);
          }
        },
      )
      .post(
        '/update/email',
        requireFullAuth,
        openApi(updateEmail),
        zValidator('json', updateEmailDto),
        limiter({ limit: 10, minutes: 60 }),
        async (c) => {
          const user = c.var.user;
          const { email } = c.req.valid('json');
          const updatedUser = await this.iamService.updateEmail(user.id, { email });
          if (!updatedUser) {
            return c.json('Cannot change email address', StatusCodes.FORBIDDEN);
          }
          return c.json({ user: updatedUser }, StatusCodes.OK);
        },
      )
      .post('/logout', requireFullAuth, openApi(logout), async (c) => {
        const sessionId = c.var.session.id;
        await this.iamService.logout(sessionId);
        const sessionCookie = createBlankSessionTokenCookie();
        setSessionCookie(c, sessionCookie);
        return c.json({ status: 'success' });
      });
  }
}
