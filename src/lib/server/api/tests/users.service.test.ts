import 'reflect-metadata'
import { CredentialsType } from '$lib/server/api/databases/tables'
import { Argon2id } from 'oslo/password'
import { container } from 'tsyringe'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { CredentialsRepository } from '../repositories/credentials.repository'
import { UsersRepository } from '../repositories/users.repository'
import { CollectionsService } from '../services/collections.service'
import { TokensService } from '../services/tokens.service'
import { UserRolesService } from '../services/user_roles.service'
import { UsersService } from '../services/users.service'
import { WishlistsService } from '../services/wishlists.service'

describe('UsersService', () => {
	let service: UsersService
	const credentialsRepository = vi.mocked(CredentialsRepository.prototype)
	const tokensService = vi.mocked(TokensService.prototype)
	const usersRepository = vi.mocked(UsersRepository.prototype)
	const userRolesService = vi.mocked(UserRolesService.prototype)
	const wishlistsService = vi.mocked(WishlistsService.prototype)
	const collectionsService = vi.mocked(CollectionsService.prototype)

	beforeAll(() => {
		service = container
			.register<CredentialsRepository>(CredentialsRepository, { useValue: credentialsRepository })
			.register<TokensService>(TokensService, { useValue: tokensService })
			.register<UsersRepository>(UsersRepository, { useValue: usersRepository })
			.register<UserRolesService>(UserRolesService, { useValue: userRolesService })
			.register<WishlistsService>(WishlistsService, { useValue: wishlistsService })
			.register<CollectionsService>(CollectionsService, { useValue: collectionsService })
			.resolve(UsersService)
	})

	afterAll(() => {
		vi.resetAllMocks()
	})

	describe('Create User', () => {
		const date = new Date()

		const hashedPassword = new Argon2id().hash('111')
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
			mfa_enabled: false,
			theme: 'system',
			createdAt: date,
			updatedAt: date,
		} satisfies Awaited<ReturnType<typeof usersRepository.create>>)

		credentialsRepository.create = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			user_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			type: CredentialsType.PASSWORD,
			secret_data: hashedPassword,
		}) satisfies Awaited<ReturnType<typeof credentialsRepository.create>>

		userRolesService.addRoleToUser = vi.fn().mockResolvedValue(undefined)

		wishlistsService.createEmptyNoName = vi.fn().mockResolvedValue(undefined)

		collectionsService.createEmptyNoName = vi.fn().mockResolvedValue(undefined)

		const spy_tokensService_createHashToken = vi.spyOn(tokensService, 'createHashedToken')
		const spy_usersRepository_create = vi.spyOn(usersRepository, 'create')
		const spy_credentialsRepository_create = vi.spyOn(credentialsRepository, 'create')
		const spy_userRolesService_addRoleToUser = vi.spyOn(userRolesService, 'addRoleToUser')
		const spy_wishlistsService_createEmptyNoName = vi.spyOn(wishlistsService, 'createEmptyNoName')
		const spy_collectionsService_createEmptyNoName = vi.spyOn(collectionsService, 'createEmptyNoName')

		it('should resolve', async () => {
			await expect(
				service.create({
					firstName: 'test',
					lastName: 'test',
					email: 'test@example.com',
					username: 'test',
					password: '111',
					confirm_password: '111',
				}),
			).resolves.toEqual({
				id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
				cuid: 'ciglo1j8q0000t9j4xq8d6p5e',
				first_name: 'test',
				last_name: 'test',
				email: 'test@example.com',
				username: 'test',
				verified: false,
				receive_email: false,
				mfa_enabled: false,
				theme: 'system',
				createdAt: date,
				updatedAt: date,
			})
		})
		// it('should generate a hashed token', async () => {
		// 	expect(spy_tokensService_createHashToken).toBeCalledTimes(1)
		// })
		// it('should create a new user', async () => {
		// 	expect(spy_usersRepository_create).toBeCalledTimes(1)
		// })
		// it('should create a new credential', async () => {
		// 	expect(spy_credentialsRepository_create).toBeCalledTimes(1)
		// })
		// it('should add role to user', async () => {
		// 	expect(spy_userRolesService_addRoleToUser).toBeCalledTimes(1)
		// })
		// it('should create a new wishlist', async () => {
		// 	expect(spy_wishlistsService_createEmptyNoName).toBeCalledTimes(1)
		// })
		// it('should create a new collection', async () => {
		// 	expect(spy_collectionsService_createEmptyNoName).toBeCalledTimes(1)
		// })
	})
	describe('Update User Password Exiting Credentials', () => {
		const hashedPassword = new Argon2id().hash('111')
		tokensService.createHashedToken = vi.fn().mockResolvedValue(hashedPassword) satisfies Awaited<ReturnType<typeof tokensService.createHashedToken>>
		credentialsRepository.update = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			user_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			type: 'PASSWORD',
			secret_data: hashedPassword,
		}) satisfies Awaited<ReturnType<typeof credentialsRepository.update>>
		credentialsRepository.findPasswordCredentialsByUserId = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			user_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			type: 'PASSWORD',
			secret_data: hashedPassword,
		}) satisfies Awaited<ReturnType<typeof credentialsRepository.findPasswordCredentialsByUserId>>

		const spy_tokensService_createHashToken = vi.spyOn(tokensService, 'createHashedToken')
		const spy_credentialsRepository_findPasswordCredentialsByUserId = vi.spyOn(credentialsRepository, 'findPasswordCredentialsByUserId')
		const spy_credentialsRepository_update = vi.spyOn(credentialsRepository, 'update')

		it('should resolve', async () => {
			await expect(service.updatePassword('3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b', '111')).resolves.toBeUndefined()
		})
		console.log(spy_tokensService_createHashToken.mock.calls)
		it('should generate a hashed token', async () => {
			expect(spy_tokensService_createHashToken).toBeCalledTimes(1)
		})
		console.log(spy_credentialsRepository_findPasswordCredentialsByUserId.mock.calls)
		it('should call find password credentials by user id', async () => {
			expect(spy_credentialsRepository_findPasswordCredentialsByUserId).toBeCalledTimes(1)
		})
		console.log(spy_credentialsRepository_update.mock.calls)
		it('should update the credential when user has credential', async () => {
			expect(spy_credentialsRepository_update).toBeCalledTimes(1)
		})
	})
	describe('Update User Password No Existing Credentials', () => {
		const hashedPassword = new Argon2id().hash('111')
		tokensService.createHashedToken = vi.fn().mockResolvedValue(hashedPassword) satisfies Awaited<ReturnType<typeof tokensService.createHashedToken>>
		credentialsRepository.findPasswordCredentialsByUserId = vi.fn().mockResolvedValue(null) satisfies Awaited<
			ReturnType<typeof credentialsRepository.findPasswordCredentialsByUserId>
		>
		credentialsRepository.create = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			user_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			type: 'PASSWORD',
			secret_data: hashedPassword,
		}) satisfies Awaited<ReturnType<typeof credentialsRepository.create>>

		const spy_tokensService_createHashToken = vi.spyOn(tokensService, 'createHashedToken')
		const spy_credentialsRepository_create = vi.spyOn(credentialsRepository, 'create')
		const spy_credentialsRepository_findPasswordCredentialsByUserId = vi.spyOn(credentialsRepository, 'findPasswordCredentialsByUserId')

		it('should resolve with no current credential for user', async () => {
			await expect(service.updatePassword('3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b', '111')).resolves.not.toThrow()
		})
		it('should generate a hashed token', async () => {
			expect(spy_tokensService_createHashToken).toBeCalledTimes(1)
		})
		it('should call find password credentials by user id', async () => {
			expect(spy_credentialsRepository_findPasswordCredentialsByUserId).toBeCalledTimes(1)
		})
		it('should create a new credential when user has no credential', async () => {
			expect(spy_credentialsRepository_create).toHaveBeenCalledTimes(1)
		})
	})
})
