import 'reflect-metadata';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { UserRolesService } from '../services/user_roles.service';
import { UserRolesRepository } from '../repositories/user_roles.repository';
import { RolesService } from '../services/roles.service';

describe('UserRolesService', () => {
	let service: UserRolesService;
	const userRolesRepository = vi.mocked(UserRolesRepository.prototype);
	const rolesService = vi.mocked(RolesService.prototype);

	beforeAll(() => {
		service = container
			.register<UserRolesRepository>(UserRolesRepository, { useValue: userRolesRepository })
			.register<RolesService>(RolesService, { useValue: rolesService })
			.resolve(UserRolesService);
	});

	afterAll(() => {
		vi.resetAllMocks()
	});

	describe('Create User Role', () => {
		rolesService.findOneByNameOrThrow = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			cuid: 'ciglo1j8q0000t9j4xq8d6p5e',
			name: 'user',
			createdAt: new Date(),
			updatedAt: new Date()
		} satisfies Awaited<ReturnType<typeof rolesService.findOneByNameOrThrow>>);

		userRolesRepository.create = vi.fn().mockResolvedValue({
			id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			cuid: 'ciglo1j8q0000t9j4xq8d6p5e',
			user_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8fff',
			role_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
			primary: true,
			createdAt: new Date(),
			updatedAt: new Date()
		} satisfies Awaited<ReturnType<typeof userRolesRepository.create>>);

		const spy_rolesService_findOneByNameOrThrow = vi.spyOn(rolesService, 'findOneByNameOrThrow');
		const spy_userRolesRepository_create = vi.spyOn(userRolesRepository, 'create');

		it('should resolve', async () => {
			await expect(service.addRoleToUser('3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8fff', 'user', true)).resolves.not.toThrowError();
		})
		it('should call rolesService.findOneByNameOrThrow', async () => {
			expect(spy_rolesService_findOneByNameOrThrow).toBeCalledWith('user');
			expect(spy_rolesService_findOneByNameOrThrow).toBeCalledTimes(1);
		})
		it('should call userRolesRepository.create', async () => {
			expect(spy_userRolesRepository_create).toBeCalledWith({
				user_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8fff',
				role_id: '3e0e9f0f-0a0b-4f0b-8f0b-0a0b4f0b8f0b',
				primary: true
			});
			expect(spy_userRolesRepository_create).toBeCalledTimes(1);
		})
	})
});