import 'reflect-metadata';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { UsersService } from '../services/users.service';
import { CredentialsRepository } from '../repositories/credentials.repository';
import { TokensService } from '../services/tokens.service';
import { UserRolesService } from '../services/user_roles.service';
import { UsersRepository } from '../repositories/users.repository';
import { Argon2id } from 'oslo/password';
import { WishlistsService } from '../services/wishlists.service';
import { CollectionsService } from '../services/collections.service';
// import { LoginRequestsService } from '../services/login-requests.service';
// import { TokensService } from '../services/tokens.service';
// import { MailerService } from '../services/mailer.service';
// import { UsersRepository } from '../repositories/users.repository';
// import { DatabaseProvider, LuciaProvider } from '../providers';
// import { LoginRequestsRepository } from '../repositories/login-requests.repository';
// import { PgDatabase } from 'drizzle-orm/pg-core';

describe('UsersService', () => {
	let service: UsersService;
	const credentialsRepository = vi.mocked(CredentialsRepository.prototype);
	const tokensService = vi.mocked(TokensService.prototype);
	const usersRepository = vi.mocked(UsersRepository.prototype);
	const userRolesService = vi.mocked(UserRolesService.prototype);
	const wishlistsService = vi.mocked(WishlistsService.prototype);
	const collectionsService = vi.mocked(CollectionsService.prototype);

  beforeAll(() => {
    service = container
      .register<CredentialsRepository>(CredentialsRepository, { useValue: credentialsRepository })
			.register<TokensService>(TokensService, { useValue: tokensService })
			.register<UsersRepository>(UsersRepository, { useValue: usersRepository })
			.register<UserRolesService>(UserRolesService, { useValue: userRolesService })
			.register<WishlistsService>(WishlistsService, { useValue: wishlistsService })
			.register<CollectionsService>(CollectionsService, { useValue: collectionsService })
      .resolve(UsersService);
  });

  afterAll(() => {
    vi.resetAllMocks()
  })

	describe('Create User', () => {
		const hashedPassword = new Argon2id().hash('111');
    tokensService.createHashedToken = vi.fn().mockResolvedValue(hashedPassword)

    usersRepository.create = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			cuid: 'ciglo1j8q0000t9j4xq8d6p5e',
			first_name: 'test',
			last_name: 'test',
			email: 'test@example.com',
			username: 'test',
			verified: false,
			receive_email: false,
			theme: 'system',
			createdAt: new Date(),
			updatedAt: new Date()
    } satisfies Awaited<ReturnType<typeof usersRepository.create>>)

		credentialsRepository.create = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			user_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			type: 'PASSWORD',
			secret_data: hashedPassword
		})

		userRolesService.addRoleToUser = vi.fn().mockResolvedValue(undefined)

		wishlistsService.createEmptyNoName = vi.fn().mockResolvedValue(undefined)

		collectionsService.createEmptyNoName = vi.fn().mockResolvedValue(undefined)

		const spy_tokensService_createHashToken = vi.spyOn(tokensService, 'createHashedToken');
		const spy_usersRepository_create = vi.spyOn(usersRepository, 'create');
		const spy_credentialsRepository_create = vi.spyOn(credentialsRepository, 'create');
		const spy_userRolesService_addRoleToUser = vi.spyOn(userRolesService, 'addRoleToUser');
		const spy_wishlistsService_createEmptyNoName = vi.spyOn(wishlistsService, 'createEmptyNoName');
		const spy_collectionsService_createEmptyNoName = vi.spyOn(collectionsService, 'createEmptyNoName');

    it('should resolve', async () => {
			await expect(service.create({
				firstName: 'test',
				lastName: 'test',
				email: 'test@example.com',
				username: 'test',
				password: '111',
				confirm_password: '111'
			})).resolves.not.toThrow()
    })
    it('should generate a hashed token', async () => {
      expect(spy_tokensService_createHashToken).toBeCalledTimes(1)
    })
    it('should create a new user', async () => {
      expect(spy_usersRepository_create).toHaveBeenCalledTimes(1)
    })
    it('should create a new credential', async () => {
      expect(spy_credentialsRepository_create).toBeCalledTimes(1)
		})
		it('should add role to user', async () => {
			expect(spy_userRolesService_addRoleToUser).toBeCalledTimes(1)
		})
		it('should create a new wishlist', async () => {
			expect(spy_wishlistsService_createEmptyNoName).toBeCalledTimes(1)
		})
		it('should create a new collection', async () => {
			expect(spy_collectionsService_createEmptyNoName).toBeCalledTimes(1)
		})
  })
});
