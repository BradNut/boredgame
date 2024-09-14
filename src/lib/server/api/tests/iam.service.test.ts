import 'reflect-metadata'
import { IamService } from '$lib/server/api/services/iam.service'
import { LuciaService } from '$lib/server/api/services/lucia.service'
import { UsersService } from '$lib/server/api/services/users.service'
import { faker } from '@faker-js/faker'
import { container } from 'tsyringe'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

describe('IamService', () => {
	let service: IamService
	const luciaService = vi.mocked(LuciaService.prototype)
	const userService = vi.mocked(UsersService.prototype)

	beforeAll(() => {
		service = container
			.register<LuciaService>(LuciaService, { useValue: luciaService })
			.register<UsersService>(UsersService, { useValue: userService })
			.resolve(IamService)
	})

	beforeEach(() => {
		vi.resetAllMocks()
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

	describe('Update Profile', () => {
		it('should update user', async () => {
			userService.findOneById = vi.fn().mockResolvedValueOnce(dbUser)
			userService.findOneByUsername = vi.fn().mockResolvedValue(undefined)
			userService.updateUser = vi.fn().mockResolvedValue(dbUser)

			const spy_userService_findOneById = vi.spyOn(userService, 'findOneById')
			const spy_userService_findOneByUsername = vi.spyOn(userService, 'findOneByUsername')
			const spy_userService_updateUser = vi.spyOn(userService, 'updateUser')
			await expect(
				service.updateProfile(faker.string.uuid(), {
					username: faker.internet.userName(),
				}),
			).resolves.toEqual(dbUser)
			expect(spy_userService_findOneById).toBeCalledTimes(1)
			expect(spy_userService_findOneByUsername).toBeCalledTimes(1)
			expect(spy_userService_updateUser).toBeCalledTimes(1)
		})

		it('should error on no user found', async () => {
			userService.findOneById = vi.fn().mockResolvedValueOnce(undefined)

			const spy_userService_findOneById = vi.spyOn(userService, 'findOneById')
			const spy_userService_findOneByUsername = vi.spyOn(userService, 'findOneByUsername')
			const spy_userService_updateUser = vi.spyOn(userService, 'updateUser')
			await expect(
				service.updateProfile(faker.string.uuid(), {
					username: faker.internet.userName(),
				}),
			).resolves.toEqual({
				error: 'User not found',
			})
			expect(spy_userService_findOneById).toBeCalledTimes(1)
			expect(spy_userService_findOneByUsername).toBeCalledTimes(0)
			expect(spy_userService_updateUser).toBeCalledTimes(0)
		})

		it('should error on duplicate username', async () => {
			userService.findOneById = vi.fn().mockResolvedValueOnce(dbUser)
			userService.findOneByUsername = vi.fn().mockResolvedValue({
				id: faker.string.uuid(),
			})
			userService.updateUser = vi.fn().mockResolvedValue(dbUser)

			const spy_userService_findOneById = vi.spyOn(userService, 'findOneById')
			const spy_userService_findOneByUsername = vi.spyOn(userService, 'findOneByUsername')
			const spy_userService_updateUser = vi.spyOn(userService, 'updateUser')
			await expect(
				service.updateProfile(faker.string.uuid(), {
					username: faker.internet.userName(),
				}),
			).resolves.toEqual({
				error: 'Username already in use',
			})
			expect(spy_userService_findOneById).toBeCalledTimes(1)
			expect(spy_userService_findOneByUsername).toBeCalledTimes(1)
			expect(spy_userService_updateUser).toBeCalledTimes(0)
		})
	})

	it('should not error if the user id of new username is the current user id', async () => {
		userService.findOneById = vi.fn().mockResolvedValueOnce(dbUser)
		userService.findOneByUsername = vi.fn().mockResolvedValue({
			id: dbUser.id,
		})
		userService.updateUser = vi.fn().mockResolvedValue(dbUser)

		const spy_userService_findOneById = vi.spyOn(userService, 'findOneById')
		const spy_userService_findOneByUsername = vi.spyOn(userService, 'findOneByUsername')
		const spy_userService_updateUser = vi.spyOn(userService, 'updateUser')
		await expect(
			service.updateProfile(dbUser.id, {
				username: dbUser.id,
			}),
		).resolves.toEqual(dbUser)
		expect(spy_userService_findOneById).toBeCalledTimes(1)
		expect(spy_userService_findOneByUsername).toBeCalledTimes(1)
		expect(spy_userService_updateUser).toBeCalledTimes(1)
	})
})
