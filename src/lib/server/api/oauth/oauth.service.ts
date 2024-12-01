import type { OAuthProviders, OAuthUser } from '$lib/server/api/common/types/oauth';
import { inject, injectable } from '@needle-di/core';
import { FederatedIdentityRepository } from '../users/federated_identity.repository';
import { UsersService } from '../users/users.service';

@injectable()
export class OAuthService {
  constructor(
    private federatedIdentityRepository = inject(FederatedIdentityRepository),
    private usersService = inject(UsersService),
  ) {}

  async handleOAuthUser(oAuthUser: OAuthUser, oauthProvider: OAuthProviders) {
    const federatedUser = await this.federatedIdentityRepository.findOneByFederatedUserIdAndProvider(oAuthUser.sub, oauthProvider);

    if (federatedUser) {
      return federatedUser.user_id;
    }

    const user = await this.usersService.createOAuthUser(oAuthUser, oauthProvider);

    if (!user) {
      throw new Error('Failed to create user');
    }
    return user.id;
  }
}
