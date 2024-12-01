import { DrizzleService } from '$lib/server/api/databases/postgres/drizzle.service';
import { inject, injectable } from '@needle-di/core';
import { type InferInsertModel, eq } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import { user_roles } from '../databases/postgres/tables';

export type CreateUserRole = InferInsertModel<typeof user_roles>;
export type UpdateUserRole = Partial<CreateUserRole>;

@injectable()
export class UserRolesRepository {
  constructor(private drizzle = inject(DrizzleService)) {}

  async findOneById(id: string, db = this.drizzle.db) {
    return db.query.user_roles.findFirst({
      where: eq(user_roles.id, id),
    });
  }

  async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
    const userRole = await this.findOneById(id, db);
    if (!userRole) throw Error('User not found');
    return userRole;
  }

  async findAllByUserId(userId: string, db = this.drizzle.db) {
    return db.query.user_roles.findMany({
      where: eq(user_roles.user_id, userId),
    });
  }

  async create(data: CreateUserRole, db = this.drizzle.db) {
    return db.insert(user_roles).values(data).returning().then(takeFirstOrThrow);
  }

  async delete(id: string, db = this.drizzle.db) {
    return db.delete(user_roles).where(eq(user_roles.id, id)).returning().then(takeFirstOrThrow);
  }
}
