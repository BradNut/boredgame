import { inject, injectable } from 'tsyringe'
import { FederatedIdentityRepository } from '../repositories/federated_identity.repository'
import { UsersService } from './users.service'

@injectable()
export class OAuthService {
	constructor(
		@inject(FederatedIdentityRepository) private readonly federatedIdentityRepository: FederatedIdentityRepository,
		@inject(UsersService) private readonly usersService: UsersService,
	) {}

	async handleOAuthUser(oauthUserId: number, oauthUsername: string, oauthProvider: string) {
		const federatedUser = await this.federatedIdentityRepository.findOneByFederatedUserIdAndProvider(`${oauthUserId}`, oauthProvider)

		if (federatedUser) {
			return federatedUser.user_id
		}

		const user = await this.usersService.createOAuthUser(oauthUserId, oauthUsername, oauthProvider)

		if (!user) {
			throw new Error('Failed to create user')
		}
		return user.id
	}
}
