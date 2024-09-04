import type { Repository } from '$lib/server/api/common/interfaces/repository.interface'
import { DatabaseProvider } from '$lib/server/api/providers/database.provider'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository.utils'
import { roles } from '../databases/tables'

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

export type CreateRole = InferInsertModel<typeof roles>
export type UpdateRole = Partial<CreateRole>

@injectable()
export class RolesRepository implements Repository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) {}

	async findOneById(id: string) {
		return this.db.query.roles.findFirst({
			where: eq(roles.id, id),
		})
	}

	async findOneByIdOrThrow(id: string) {
		const role = await this.findOneById(id)
		if (!role) throw Error('Role not found')
		return role
	}

	async findAll() {
		return this.db.query.roles.findMany()
	}

	async findOneByName(name: string) {
		return this.db.query.roles.findFirst({
			where: eq(roles.name, name),
		})
	}

	async findOneByNameOrThrow(name: string) {
		const role = await this.findOneByName(name)
		if (!role) throw Error('Role not found')
		return role
	}

	async create(data: CreateRole) {
		return this.db.insert(roles).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateRole) {
		return this.db.update(roles).set(data).where(eq(roles.id, id)).returning().then(takeFirstOrThrow)
	}

	async delete(id: string) {
		return this.db.delete(roles).where(eq(roles.id, id)).returning().then(takeFirstOrThrow)
	}

	trxHost(trx: DatabaseProvider) {
		return new RolesRepository(trx)
	}
}
