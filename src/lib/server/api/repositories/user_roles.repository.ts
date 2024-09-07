import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository'
import { user_roles } from '../databases/tables'

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/*
Repositories are the layer that interacts with the database. They are responsible for retrieving and
storing data. They should not contain any business logic, only database queries.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
 Repositories should only contain methods for CRUD operations and any other database interactions.
 Any complex logic should be delegated to a service. If a repository method requires a transaction,
 it should be passed in as an argument or the class should have a method to set the transaction.
 In our case the method 'trxHost' is used to set the transaction context.
*/

export type CreateUserRole = InferInsertModel<typeof user_roles>
export type UpdateUserRole = Partial<CreateUserRole>

@injectable()
export class UserRolesRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.user_roles.findFirst({
			where: eq(user_roles.id, id),
		})
	}

	async findOneByIdOrThrow(id: string) {
		const userRole = await this.findOneById(id)
		if (!userRole) throw Error('User not found')
		return userRole
	}

	async findAllByUserId(userId: string, db = this.drizzle.db) {
		return db.query.user_roles.findMany({
			where: eq(user_roles.user_id, userId),
		})
	}

	async create(data: CreateUserRole, db = this.drizzle.db) {
		return db.insert(user_roles).values(data).returning().then(takeFirstOrThrow)
	}

	async delete(id: string, db = this.drizzle.db) {
		return db.delete(user_roles).where(eq(user_roles.id, id)).returning().then(takeFirstOrThrow)
	}
}
