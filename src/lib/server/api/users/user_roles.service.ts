import type { db } from '$lib/server/api/packages/drizzle';
import { RolesService } from '$lib/server/api/users/roles.service';
import { type CreateUserRole, UserRolesRepository } from '$lib/server/api/users/user_roles.repository';
import { inject, injectable } from '@needle-di/core';

@injectable()
export class UserRolesService {
  constructor(
    private userRolesRepository = inject(UserRolesRepository),
    private rolesService = inject(RolesService),
  ) {}

  async findOneById(id: string) {
    return this.userRolesRepository.findOneById(id);
  }

  async findAllByUserId(userId: string) {
    return this.userRolesRepository.findAllByUserId(userId);
  }

  async create(data: CreateUserRole) {
    return this.userRolesRepository.create(data);
  }

  async addRoleToUser(userId: string, roleName: string, primary = false, trx: Parameters<Parameters<typeof db.transaction>[0]>[0] | null = null) {
    // Find the role by its name
    const role = await this.rolesService.findOneByNameOrThrow(roleName);

    if (!role || !role.id) {
      throw new Error(`Role with name ${roleName} not found`);
    }

    if (!trx) {
      return this.userRolesRepository.create({
        user_id: userId,
        role_id: role.id,
        primary,
      });
    }

    // Create a UserRole entry linking the user and the role
    return this.userRolesRepository.create(
      {
        user_id: userId,
        role_id: role.id,
        primary,
      },
      trx,
    );
  }
}
