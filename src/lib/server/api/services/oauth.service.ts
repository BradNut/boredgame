import { inject, injectable } from 'tsyringe'
import { FederatedIdentityRepository } from '../repositories/federated_identity.repository'
import { UsersService } from './users.service'
import type {OAuthUser, OAuthProviders} from "$lib/server/api/common/types/oauth";

@injectable()
export class OAuthService {
	constructor(
		@inject(FederatedIdentityRepository) private readonly federatedIdentityRepository: FederatedIdentityRepository,
		@inject(UsersService) private readonly usersService: UsersService,
	) {}

	async handleOAuthUser(oAuthUser: OAuthUser, oauthProvider: OAuthProviders) {
		const federatedUser = await this.federatedIdentityRepository.findOneByFederatedUserIdAndProvider(oAuthUser.sub, oauthProvider)

		if (federatedUser) {
			return federatedUser.user_id
		}

		const user = await this.usersService.createOAuthUser(oAuthUser, oauthProvider)

		if (!user) {
			throw new Error('Failed to create user')
		}
		return user.id
	}
}
