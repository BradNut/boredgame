import {usersTable} from '$lib/server/api/databases/postgres/tables/users.table';
import {DrizzleService} from '$lib/server/api/services/drizzle.service';
import {eq, type InferInsertModel} from 'drizzle-orm';
import {inject, injectable} from '@needle-di/core';
import {takeFirstOrThrow} from '../common/utils/repository';

export type CreateUser = InferInsertModel<typeof usersTable>;
export type UpdateUser = Partial<CreateUser>;

@injectable()
export class UsersRepository {
	constructor(private drizzle = inject(DrizzleService)) {}

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.id, id),
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const user = await this.findOneById(id);
		if (!user) throw Error('User not found');
		return user;
	}

	async findOneByUsername(username: string, db = this.drizzle.db) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.username, username),
		});
	}

	async findOneByEmail(email: string, db = this.drizzle.db) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.email, email),
		});
	}

	async create(data: CreateUser, db = this.drizzle.db) {
		return db.insert(usersTable).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateUser, db = this.drizzle.db) {
		return db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning().then(takeFirstOrThrow);
	}

	async delete(id: string, db = this.drizzle.db) {
		return db.delete(usersTable).where(eq(usersTable.id, id)).returning().then(takeFirstOrThrow);
	}
}
