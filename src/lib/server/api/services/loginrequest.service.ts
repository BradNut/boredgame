import { inject, injectable } from 'tsyringe';
import { BadRequest } from '../common/errors';
import { DatabaseProvider } from '../providers';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { LuciaProvider } from '../providers/lucia.provider';
import { UsersRepository } from '../repositories/users.repository';
import type { SignInEmailDto } from '../../../dtos/signin-email.dto';
import { CredentialsRepository } from '../repositories/credentials.repository';
import type { HonoRequest } from 'hono';

@injectable()
export class LoginRequestsService {
  constructor(
    @inject(LuciaProvider) private readonly lucia: LuciaProvider,
    @inject(DatabaseProvider) private readonly db: DatabaseProvider,
    @inject(TokensService) private readonly tokensService: TokensService,
    @inject(MailerService) private readonly mailerService: MailerService,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(CredentialsRepository) private readonly credentialsRepository: CredentialsRepository,
  ) { }

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

  async verify(data: SignInEmailDto, req: HonoRequest) {
    const requestIpAddress = req.header('x-real-ip');
    const requestIpCountry = req.header('x-vercel-ip-country');
    const existingUser = await this.usersRepository.findOneByUsername(data.username);

    if (!existingUser) {
     throw BadRequest('User not found');
		}

    const credential = await this.credentialsRepository.findPasswordCredentialsByUserId(existingUser.id);

    if (!credential) {
      throw BadRequest('Invalid credentials');
    }

    if (!await this.tokensService.verifyHashedToken(credential.hashedPassword, data.password)) {
      throw BadRequest('Invalid credentials');
    }

    const totpCredentials = await this.credentialsRepository.findTOTPCredentialsByUserId(existingUser.id);

    return this.lucia.createSession(existingUser.id, {
      ip_country: requestIpCountry || 'unknown',
      ip_address: requestIpAddress || 'unknown',
      twoFactorAuthEnabled:
        !!totpCredentials &&
        totpCredentials?.secret !== null &&
        totpCredentials?.secret !== '',
      isTwoFactorAuthenticated: false,
    });
  }

  // Create a new user and send a welcome email - or other onboarding process
  private async handleNewUserRegistration(email: string) {
    const newUser = await this.usersRepository.create({ email, verified: true, avatar: null })
    this.mailerService.sendWelcome({ to: email, props: null });
    // TODO: add whatever onboarding process or extra data you need here
    return newUser
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