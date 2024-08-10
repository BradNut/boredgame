import { eq, type InferInsertModel } from 'drizzle-orm';
import { usersTable } from '../infrastructure/database/tables/users.table';
import { takeFirstOrThrow } from '../infrastructure/database/utils';
import {inject, injectable} from "tsyringe";
import {DatabaseProvider} from "$lib/server/api/providers";

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

export type CreateUser = InferInsertModel<typeof usersTable>;
export type UpdateUser = Partial<CreateUser>;

@injectable()
export class UsersRepository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) { }

	async findOneById(id: string) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string) {
		const user = await this.findOneById(id);
		if (!user) throw Error('User not found');
		return user;
	}

	async findOneByUsername(username: string) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.username, username)
		});
	}

	async findOneByEmail(email: string) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.email, email)
		});
	}

	async create(data: CreateUser) {
		return db.insert(usersTable).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateUser) {
		return db
			.update(usersTable)
			.set(data)
			.where(eq(usersTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	async delete(id: string) {
		return db
			.delete(usersTable)
			.where(eq(usersTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}
}
