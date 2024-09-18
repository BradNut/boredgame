import type { db } from '$lib/server/api/packages/drizzle'
import { type CreateUserRole, UserRolesRepository } from '$lib/server/api/repositories/user_roles.repository'
import { RolesService } from '$lib/server/api/services/roles.service'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UserRolesService {
	constructor(
		@inject(UserRolesRepository) private readonly userRolesRepository: UserRolesRepository,
		@inject(RolesService) private readonly rolesService: RolesService,
	) {}

	async findOneById(id: string) {
		return this.userRolesRepository.findOneById(id)
	}

	async findAllByUserId(userId: string) {
		return this.userRolesRepository.findAllByUserId(userId)
	}

	async create(data: CreateUserRole) {
		return this.userRolesRepository.create(data)
	}

	async addRoleToUser(userId: string, roleName: string, primary = false, trx: Parameters<Parameters<typeof db.transaction>[0]>[0] | null = null) {
		// Find the role by its name
		const role = await this.rolesService.findOneByNameOrThrow(roleName)

		if (!role || !role.id) {
			throw new Error(`Role with name ${roleName} not found`)
		}

		if (!trx) {
			return this.userRolesRepository.create({
				user_id: userId,
				role_id: role.id,
				primary,
			})
		}

		// Create a UserRole entry linking the user and the role
		return this.userRolesRepository.create(
			{
				user_id: userId,
				role_id: role.id,
				primary,
			},
			trx,
		)
	}
}
