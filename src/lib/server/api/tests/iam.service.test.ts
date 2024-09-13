import 'reflect-metadata'
import { IamService } from '$lib/server/api/services/iam.service'
import { LuciaService } from '$lib/server/api/services/lucia.service'
import { UsersService } from '$lib/server/api/services/users.service'
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

	describe('Update Profile', () => {
		it('should resolve', async () => {
			const timeStampDate = new Date()
			userService.findOneById = vi.fn().mockResolvedValueOnce({
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
				createdAt: timeStampDate,
				updatedAt: timeStampDate,
			})
			userService.findOneByUsername = vi.fn().mockResolvedValue(undefined)
			userService.updateUser = vi.fn().mockResolvedValue({
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
				createdAt: timeStampDate,
				updatedAt: timeStampDate,
			})

			const spy_userService_findOneById = vi.spyOn(userService, 'findOneById')
			const spy_userService_findOneByUsername = vi.spyOn(userService, 'findOneByUsername')
			const spy_userService_updateUser = vi.spyOn(userService, 'updateUser')
			await expect(
				service.updateProfile('3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b', {
					username: 'test',
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
				createdAt: timeStampDate,
				updatedAt: timeStampDate,
			})
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
				service.updateProfile('3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b', {
					username: 'test',
				}),
			).resolves.toEqual({
				error: 'User not found',
			})
			expect(spy_userService_findOneById).toBeCalledTimes(1)
			expect(spy_userService_findOneByUsername).toBeCalledTimes(0)
			expect(spy_userService_updateUser).toBeCalledTimes(0)
		})
	})
})
