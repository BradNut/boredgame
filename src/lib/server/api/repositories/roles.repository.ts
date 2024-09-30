import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository'
import { rolesTable } from '../databases/tables'

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

export type CreateRole = InferInsertModel<typeof rolesTable>
export type UpdateRole = Partial<CreateRole>

@injectable()
export class RolesRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.rolesTable.findFirst({
			where: eq(rolesTable.id, id),
		})
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const role = await this.findOneById(id, db)
		if (!role) throw Error('Role not found')
		return role
	}

	async findAll(db = this.drizzle.db) {
		return db.query.rolesTable.findMany()
	}

	async findOneByName(name: string, db = this.drizzle.db) {
		return db.query.rolesTable.findFirst({
			where: eq(rolesTable.name, name),
		})
	}

	async findOneByNameOrThrow(name: string, db = this.drizzle.db) {
		const role = await this.findOneByName(name, db)
		if (!role) throw Error('Role not found')
		return role
	}

	async create(data: CreateRole, db = this.drizzle.db) {
		return db.insert(rolesTable).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateRole, db = this.drizzle.db) {
		return db.update(rolesTable).set(data).where(eq(rolesTable.id, id)).returning().then(takeFirstOrThrow)
	}

	async delete(id: string, db = this.drizzle.db) {
		return db.delete(rolesTable).where(eq(rolesTable.id, id)).returning().then(takeFirstOrThrow)
	}
}
