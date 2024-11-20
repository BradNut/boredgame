import type { SigninUsernameDto } from '$lib/server/api/dtos/signin-username.dto';
import { SessionsService } from '$lib/server/api/services/sessions.service';
import type { HonoRequest } from 'hono';
import { inject, injectable } from '@needle-di/core';
import { BadRequest } from '../common/exceptions';
import type { Credentials } from '../databases/postgres/tables';
import { CredentialsRepository } from '../repositories/credentials.repository';
import { UsersRepository } from '../repositories/users.repository';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { DrizzleService } from '$lib/server/api/services/drizzle.service';

@injectable()
export class LoginRequestsService {
  constructor(
    private sessionsService = inject(SessionsService),
    private drizzleService = inject(DrizzleService),
    private tokensService = inject(TokensService),
    private mailerService = inject(MailerService),
    private usersRepository = inject(UsersRepository),
    private credentialsRepository = inject(CredentialsRepository),
  ) {}

  // async create(data: RegisterEmailDto) {
  //   // generate a token, expiry date, and hash
  //   const { token, expiry, hashedToken } = await this.tokensService.generateTokenWithExpiryAndHash(15, 'm');
  //   // save the login request to the database - ensuring we save the hashedToken
  //   await this.loginRequestsRepository.create({ email: data.email, hashedToken, expiresAt: expiry });
  //   // send the login request email
  //   await this.mailerService.sendLoginRequest({
  //     to: data.email,
  //     props: { token: token }
  //   });
  // }

  async verify(data: SigninUsernameDto, req: HonoRequest) {
    const requestIpAddress = req.header('X-Forwarded-For');
    const requestIpCountry = req.header('x-vercel-ip-country');
    const existingUser = await this.usersRepository.findOneByUsername(data.username);

    if (!existingUser) {
      throw BadRequest('User not found');
    }

    const credential = await this.credentialsRepository.findPasswordCredentialsByUserId(existingUser.id);

    if (!credential) {
      throw BadRequest('Invalid credentials');
    }

    if (!(await this.tokensService.verifyHashedToken(credential.secret_data, data.password))) {
      throw BadRequest('Invalid credentials');
    }

    const totpCredentials = await this.credentialsRepository.findTOTPCredentialsByUserId(existingUser.id);

    return await this.createUserSession(existingUser.id, req, !!totpCredentials && totpCredentials.secret_data !== null && totpCredentials.secret_data !== '');
  }

  async createUserSession(existingUserId: string, req: HonoRequest, twoFactorAuthEnabled: boolean) {
    const requestIpAddress = req.header('X-Forwarded-For');
    const requestIpCountry = req.header('x-vercel-ip-country');
    return this.sessionsService.createSession(
      this.sessionsService.generateSessionToken(),
      existingUserId,
      requestIpCountry || 'unknown',
      requestIpAddress || 'unknown',
      twoFactorAuthEnabled,
      false,
    );
  }

  // Create a new user and send a welcome email - or other onboarding process
  private async handleNewUserRegistration(email: string) {
    const newUser = await this.usersRepository.create({ email, verified: true });
    // this.mailerService.sendWelcome({ to: email, props: null });
    // TODO: add whatever onboarding process or extra data you need here
    return newUser;
  }

  // Fetch a valid request from the database, verify the token and burn the request if it is valid
  // private async fetchValidRequest(email: string, token: string) {
  //   return await this.db.transaction(async (trx) => {
  //     // fetch the login request
  //     const loginRequest = await this.loginRequestsRepository.trxHost(trx).findOneByEmail(email)
  //     if (!loginRequest) return null;

  //     // check if the token is valid
  //     const isValidRequest = await this.tokensService.verifyHashedToken(loginRequest.hashedToken, token);
  //     if (!isValidRequest) return null

  //     // if the token is valid, burn the request
  //     await this.loginRequestsRepository.trxHost(trx).deleteById(loginRequest.id);
  //     return loginRequest
  //   })
  // }
}
