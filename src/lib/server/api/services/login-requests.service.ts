import { BadRequest } from '../common/errors';
import { DatabaseProvider } from '../providers';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { LuciaProvider } from '../providers/lucia.provider';
import { UsersRepository } from '../repositories/users.repository';
import type { SignInEmailDto } from '../../../dtos/signin-email.dto';
import type { RegisterEmailDto } from '../../../dtos/register-email.dto';
import { LoginRequestsRepository } from '../repositories/login-requests.repository';

export class LoginRequestsService {
	async create(data: RegisterEmailDto) {
		// generate a token, expiry date, and hash
		const { token, expiry, hashedToken } = await this.tokensService.generateTokenWithExpiryAndHash(15, 'm');
		// save the login request to the database - ensuring we save the hashedToken
		await this.loginRequestsRepository.create({ email: data.email, hashedToken, expiresAt: expiry });
		// send the login request email
		await this.mailerService.sendLoginRequest({
			to: data.email,
			props: { token: token }
		});
	}

	async verify(data: SignInEmailDto) {
		const validLoginRequest = await this.fetchValidRequest(data.email, data.token);
		if (!validLoginRequest) throw BadRequest('Invalid token');

		let existingUser = await this.usersRepository.findOneByEmail(data.email);

		if (!existingUser) {
			const newUser = await this.handleNewUserRegistration(data.email);
			return this.lucia.createSession(newUser.id, {});
		}

		return this.lucia.createSession(existingUser.id, {});
	}

	// Create a new user and send a welcome email - or other onboarding process
	private async handleNewUserRegistration(email: string) {
		const newUser = await this.usersRepository.create({ email, verified: true, avatar: null })
		this.mailerService.sendWelcome({ to: email, props: null });
		// TODO: add whatever onboarding process or extra data you need here
		return newUser
	}

	// Fetch a valid request from the database, verify the token and burn the request if it is valid
	private async fetchValidRequest(email: string, token: string) {
		return await this.db.transaction(async (trx) => {
			// fetch the login request
			const loginRequest = await this.loginRequestsRepository.trxHost(trx).findOneByEmail(email)
			if (!loginRequest) return null;

			// check if the token is valid
			const isValidRequest = await this.tokensService.verifyHashedToken(loginRequest.hashedToken, token);
			if (!isValidRequest) return null

			// if the token is valid, burn the request
			await this.loginRequestsRepository.trxHost(trx).deleteById(loginRequest.id);
			return loginRequest
		})
	}
}