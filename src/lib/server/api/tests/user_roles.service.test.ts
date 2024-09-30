import 'reflect-metadata'
import { RoleName } from '$lib/server/api/databases/tables'
import { faker } from '@faker-js/faker'
import { container } from 'tsyringe'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { UserRolesRepository } from '../repositories/user_roles.repository'
import { RolesService } from '../services/roles.service'
import { UserRolesService } from '../services/user_roles.service'

describe('UserRolesService', () => {
	let service: UserRolesService
	const userRolesRepository = vi.mocked(UserRolesRepository.prototype)
	const rolesService = vi.mocked(RolesService.prototype)

	beforeAll(() => {
		service = container
			.register<UserRolesRepository>(UserRolesRepository, { useValue: userRolesRepository })
			.register<RolesService>(RolesService, { useValue: rolesService })
			.resolve(UserRolesService)
	})

	afterAll(() => {
		vi.resetAllMocks()
	})

	const timeStampDate = new Date()
	const roleUUID = faker.string.uuid()
	const userUUID = faker.string.uuid()
	const dbRole = {
		id: roleUUID,
		cuid: 'ciglo1j8q0000t9j4xq8d6p5e',
		name: RoleName.ADMIN,
		createdAt: timeStampDate,
		updatedAt: timeStampDate,
	}

	const dbUserRole = {
		id: faker.string.uuid(),
		cuid: 'ciglo1j8q0000t9j4xq8d6p5e',
		role_id: roleUUID,
		user_id: userUUID,
		primary: true,
		createdAt: timeStampDate,
		updatedAt: timeStampDate,
	}

	describe('Create User Role', () => {
		it('should resolve', async () => {
			rolesService.findOneByNameOrThrow = vi.fn().mockResolvedValue(dbRole satisfies Awaited<ReturnType<typeof rolesService.findOneByNameOrThrow>>)

			userRolesRepository.create = vi.fn().mockResolvedValue(dbUserRole satisfies Awaited<ReturnType<typeof userRolesRepository.create>>)

			const spy_rolesService_findOneByNameOrThrow = vi.spyOn(rolesService, 'findOneByNameOrThrow')
			const spy_userRolesRepository_create = vi.spyOn(userRolesRepository, 'create')

			await expect(service.addRoleToUser(userUUID, RoleName.ADMIN, true)).resolves.not.toThrowError()
			expect(spy_rolesService_findOneByNameOrThrow).toBeCalledWith(RoleName.ADMIN)
			expect(spy_rolesService_findOneByNameOrThrow).toBeCalledTimes(1)
			expect(spy_userRolesRepository_create).toBeCalledWith({
				user_id: userUUID,
				role_id: dbRole.id,
				primary: true,
			})
			expect(spy_userRolesRepository_create).toBeCalledTimes(1)
		})
		it('should error on no role found', async () => {
			rolesService.findOneByNameOrThrow = vi.fn().mockResolvedValue(undefined)

			const spy_rolesService_findOneByNameOrThrow = vi.spyOn(rolesService, 'findOneByNameOrThrow')
			await expect(service.addRoleToUser(userUUID, RoleName.ADMIN, true)).rejects.toThrowError(`Role with name ${RoleName.ADMIN} not found`)
			expect(spy_rolesService_findOneByNameOrThrow).toBeCalledWith(RoleName.ADMIN)
			expect(spy_rolesService_findOneByNameOrThrow).toBeCalledTimes(1)
		})
	})
})
