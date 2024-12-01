import { requireFullAuth, requireTempAuth } from '$lib/server/api/common/middleware/require-auth.middleware';
import { Controller } from '$lib/server/api/common/types/controller';
import { verifyTotpDto } from '$lib/server/api/dtos/verify-totp.dto';
import { TotpService } from '$lib/server/api/mfa/totp.service';
import { RecoveryCodesService } from '$lib/server/api/users/recovery-codes.service';
import { UsersService } from '$lib/server/api/users/users.service';
import { StatusCodes } from '$lib/utils/status-codes';
import { zValidator } from '@hono/zod-validator';
import { inject, injectable } from '@needle-di/core';
import { decodeBase64 } from '@oslojs/encoding';
import { cookieExpiresAt, createSessionTokenCookie, setSessionCookie } from '../common/utils/cookies';
import { CredentialsType } from '../databases/postgres/tables';
import { createTwoFactorSchema } from '../dtos/create-totp.dto';
import { LoginRequestsService } from '../login/loginrequest.service';

@injectable()
export class MfaController extends Controller {
  constructor(
    private loginRequestService = inject(LoginRequestsService),
    private recoveryCodesService = inject(RecoveryCodesService),
    private totpService = inject(TotpService),
    private usersService = inject(UsersService),
  ) {
    super();
  }

  routes() {
    return this.controller
      .get('/totp', requireTempAuth, async (c) => {
        const user = c.var.user;
        c.var.logger.info(`The user ${user.id} is requesting TOTP credentials`);
        const totpCredential = await this.totpService.findOneByUserId(user.id);
        return c.json({ totpCredential });
      })
      .post('/totp', requireTempAuth, zValidator('json', createTwoFactorSchema), async (c) => {
        const user = c.var.user;
        const { key } = c.req.valid('json');
        const totpCredential = await this.totpService.create(user.id, decodeBase64(key));
        if (totpCredential) {
          await this.usersService.updateUser(user.id, { mfa_enabled: true });
          return c.json({ totpCredential });
        }
        return c.status(StatusCodes.INTERNAL_SERVER_ERROR);
      })
      .delete('/totp', requireFullAuth, async (c) => {
        const user = c.var.user;
        try {
          await this.totpService.deleteOneByUserIdAndType(user.id, CredentialsType.TOTP);
          await this.recoveryCodesService.deleteAllRecoveryCodesByUserId(user.id);
          await this.usersService.updateUser(user.id, { mfa_enabled: false });
          console.log('TOTP deleted');
          return c.body(null, StatusCodes.NO_CONTENT);
        } catch (e) {
          console.error(e);
          return c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })
      .get('/totp/recoveryCodes', requireFullAuth, async (c) => {
        const user = c.var.user;
        // You can only view recovery codes once and that is on creation
        const existingCodes = await this.recoveryCodesService.findAllRecoveryCodesByUserId(user.id);
        if (existingCodes && existingCodes.length > 0) {
          console.log('Recovery Codes found', existingCodes);
          // Filter out codes that are not used and only return the code
          const codes = existingCodes.filter((code) => !code.used).map((code) => code.code);
          return c.json({ recoveryCodes: codes });
        }
        const recoveryCodes = await this.recoveryCodesService.createRecoveryCodes(user.id);
        return c.json({ recoveryCodes });
      })
      .post('/totp/recoveryCodes', requireFullAuth, zValidator('json', verifyTotpDto), async (c) => {
        try {
          const user = c.var.user;
          const { code } = c.req.valid('json');
          c.var.logger.info(`Verifying code ${code} for user ${user.id}`);
          const verified = await this.recoveryCodesService.verify(user.id, code);
          if (verified) {
            return c.json({}, StatusCodes.OK);
          }
          return c.json('Invalid code', StatusCodes.BAD_REQUEST);
        } catch (e) {
          console.error(e);
          return c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })
      .post('/totp/verify', requireTempAuth, zValidator('json', verifyTotpDto), async (c) => {
        try {
          const user = c.var.user;
          const { code } = c.req.valid('json');
          c.var.logger.info(`Verifying code ${code} for user ${user.id}`);
          const verified = await this.totpService.verify(user.id, code);
          if (verified) {
            await this.usersService.updateUser(user.id, { mfa_enabled: true });
            const session = await this.loginRequestService.createUserSession(user.id, c.req, true, true);
            const sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
            console.log('set cookie', sessionCookie);
            setSessionCookie(c, sessionCookie);
            return c.json({}, StatusCodes.OK);
          }
          return c.json('Invalid code', StatusCodes.BAD_REQUEST);
        } catch (e) {
          console.error(e);
          return c.status(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      });
  }
}
