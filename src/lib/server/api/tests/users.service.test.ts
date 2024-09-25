import 'reflect-metadata'
import { CredentialsType } from '$lib/server/api/databases/tables'
import { faker } from '@faker-js/faker'
import { container } from 'tsyringe'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { CredentialsRepository } from '../repositories/credentials.repository'
import { UsersRepository } from '../repositories/users.repository'
import { CollectionsService } from '../services/collections.service'
import { DrizzleService } from '../services/drizzle.service'
import { TokensService } from '../services/tokens.service'
import { UserRolesService } from '../services/user_roles.service'
import { UsersService } from '../services/users.service'
import { WishlistsService } from '../services/wishlists.service'

describe('UsersService', () => {
	let service: UsersService
	const credentialsRepository = vi.mocked(CredentialsRepository.prototype)
	const drizzleService = vi.mocked(DrizzleService.prototype, { deep: true })
	const tokensService = vi.mocked(TokensService.prototype)
	const usersRepository = vi.mocked(UsersRepository.prototype)
	const userRolesService = vi.mocked(UserRolesService.prototype)
	const wishlistsService = vi.mocked(WishlistsService.prototype)
	const collectionsService = vi.mocked(CollectionsService.prototype)

	// Mocking the dependencies
	vi.mock('pg', () => ({
		Pool: vi.fn().mockImplementation(() => ({
			connect: vi.fn(),
			end: vi.fn(),
		})),
	}))

	vi.mock('drizzle-orm/node-postgres', () => ({
		drizzle: vi.fn().mockImplementation(() => ({
			transaction: vi.fn().mockImplementation((callback) => callback()),
			// Add other methods you need to mock
		})),
	}))

	beforeAll(() => {
		service = container
			.register<CredentialsRepository>(CredentialsRepository, { useValue: credentialsRepository })
			.register<DrizzleService>(DrizzleService, { useValue: drizzleService })
			.register<TokensService>(TokensService, { useValue: tokensService })
			.register<UsersRepository>(UsersRepository, { useValue: usersRepository })
			.register<UserRolesService>(UserRolesService, { useValue: userRolesService })
			.register<WishlistsService>(WishlistsService, { useValue: wishlistsService })
			.register<CollectionsService>(CollectionsService, { useValue: collectionsService })
			.resolve(UsersService)

		drizzleService.db = {
			transaction: vi.fn().mockImplementation(async (callback) => {
				return await callback()
			}),
		} as any
	})

	afterAll(() => {
		vi.resetAllMocks()
	})

	const timeStampDate = new Date()
	const dbUser = {
		id: faker.string.uuid(),
		cuid: 'ciglo1j8q0000t9j4xq8d6p5e',
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		email: faker.internet.email(),
		username: faker.internet.userName(),
		verified: false,
		receive_email: false,
		mfa_enabled: false,
		theme: 'system',
		createdAt: timeStampDate,
		updatedAt: timeStampDate,
	}
	const dbCredentials = {
		id: faker.string.uuid(),
		user_id: dbUser.id,
		type: CredentialsType.PASSWORD,
		secret_data: 'hashedPassword',
		createdAt: timeStampDate,
		updatedAt: timeStampDate,
	}

	describe('Create User', () => {
		it('should resolve', async () => {
			const hashedPassword = 'testhash'
			tokensService.createHashedToken = vi.fn().mockResolvedValue(hashedPassword)
			// drizzleService.db = {
			// 	transaction: vi.fn().mockResolvedValue(dbUser satisfies Awaited<ReturnType<typeof drizzleService.db.transaction>>),
			// }
			usersRepository.create = vi.fn().mockResolvedValue(dbUser satisfies Awaited<ReturnType<typeof usersRepository.create>>)
			credentialsRepository.create = vi.fn().mockResolvedValue(dbCredentials satisfies Awaited<ReturnType<typeof credentialsRepository.create>>)
			userRolesService.addRoleToUser = vi.fn().mockResolvedValue(undefined)
			wishlistsService.createEmptyNoName = vi.fn().mockResolvedValue(undefined)
			collectionsService.createEmptyNoName = vi.fn().mockResolvedValue(undefined)

			const spy_tokensService_createHashToken = vi.spyOn(tokensService, 'createHashedToken')
			const spy_usersRepository_create = vi.spyOn(usersRepository, 'create')
			const spy_credentialsRepository_create = vi.spyOn(credentialsRepository, 'create')
			const spy_userRolesService_addRoleToUser = vi.spyOn(userRolesService, 'addRoleToUser')
			const spy_wishlistsService_createEmptyNoName = vi.spyOn(wishlistsService, 'createEmptyNoName')
			const spy_collectionsService_createEmptyNoName = vi.spyOn(collectionsService, 'createEmptyNoName')
			await expect(
				service.create({
					firstName: faker.person.firstName(),
					lastName: faker.person.lastName(),
					email: faker.internet.email(),
					username: faker.internet.userName(),
					password: faker.string.alphanumeric(10),
					confirm_password: faker.string.alphanumeric(10),
				}),
			).resolves.toEqual(dbUser)
			expect(spy_tokensService_createHashToken).toBeCalledTimes(1)
			expect(spy_usersRepository_create).toBeCalledTimes(1)
			expect(spy_credentialsRepository_create).toBeCalledTimes(1)
			expect(spy_userRolesService_addRoleToUser).toBeCalledTimes(1)
			expect(spy_wishlistsService_createEmptyNoName).toBeCalledTimes(1)
			expect(spy_collectionsService_createEmptyNoName).toBeCalledTimes(1)
		})
	})
	describe('Update User', () => {
		it('should resolve Password Exiting Credentials', async () => {
			const hashedPassword = 'testhash'
			tokensService.createHashedToken = vi.fn().mockResolvedValue(hashedPassword)
			credentialsRepository.update = vi.fn().mockResolvedValue(dbCredentials satisfies Awaited<ReturnType<typeof credentialsRepository.update>>)
			credentialsRepository.findPasswordCredentialsByUserId = vi
				.fn()
				.mockResolvedValue(dbCredentials satisfies Awaited<ReturnType<typeof credentialsRepository.findPasswordCredentialsByUserId>>)

			const spy_tokensService_createHashToken = vi.spyOn(tokensService, 'createHashedToken')
			const spy_credentialsRepository_findPasswordCredentialsByUserId = vi.spyOn(credentialsRepository, 'findPasswordCredentialsByUserId')
			const spy_credentialsRepository_update = vi.spyOn(credentialsRepository, 'update')
			await expect(service.updatePassword(dbUser.id, faker.string.alphanumeric(10))).resolves.toBeUndefined()
			expect(spy_tokensService_createHashToken).toBeCalledTimes(1)
			expect(spy_credentialsRepository_findPasswordCredentialsByUserId).toBeCalledTimes(1)
			expect(spy_credentialsRepository_update).toBeCalledTimes(1)
		})
		it('Should Create User Password No Existing Credentials', async () => {
			const hashedPassword = 'testhash'
			tokensService.createHashedToken = vi.fn().mockResolvedValue(hashedPassword)
			credentialsRepository.findPasswordCredentialsByUserId = vi.fn().mockResolvedValue(null)
			credentialsRepository.create = vi.fn().mockResolvedValue(dbCredentials satisfies Awaited<ReturnType<typeof credentialsRepository.create>>)

			const spy_tokensService_createHashToken = vi.spyOn(tokensService, 'createHashedToken')
			const spy_credentialsRepository_create = vi.spyOn(credentialsRepository, 'create')
			const spy_credentialsRepository_findPasswordCredentialsByUserId = vi.spyOn(credentialsRepository, 'findPasswordCredentialsByUserId')

			await expect(service.updatePassword(dbUser.id, faker.string.alphanumeric(10))).resolves.not.toThrow()
			expect(spy_tokensService_createHashToken).toBeCalledTimes(1)
			expect(spy_credentialsRepository_findPasswordCredentialsByUserId).toBeCalledTimes(1)
			expect(spy_credentialsRepository_create).toHaveBeenCalledTimes(1)
		})
	})
})
