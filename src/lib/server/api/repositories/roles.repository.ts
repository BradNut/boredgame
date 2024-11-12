import {DrizzleService} from '$lib/server/api/services/drizzle.service';
import {eq, type InferInsertModel} from 'drizzle-orm';
import {inject, injectable} from '@needle-di/core';
import {takeFirstOrThrow} from '../common/utils/repository';
import {rolesTable} from '../databases/postgres/tables';

export type CreateRole = InferInsertModel<typeof rolesTable>;
export type UpdateRole = Partial<CreateRole>;

@injectable()
export class RolesRepository {
	constructor(private drizzle = inject(DrizzleService)) {}

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.rolesTable.findFirst({
			where: eq(rolesTable.id, id),
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const role = await this.findOneById(id, db);
		if (!role) throw Error('Role not found');
		return role;
	}

	async findAll(db = this.drizzle.db) {
		return db.query.rolesTable.findMany();
	}

	async findOneByName(name: string, db = this.drizzle.db) {
		return db.query.rolesTable.findFirst({
			where: eq(rolesTable.name, name),
		});
	}

	async findOneByNameOrThrow(name: string, db = this.drizzle.db) {
		const role = await this.findOneByName(name, db);
		if (!role) throw Error('Role not found');
		return role;
	}

	async create(data: CreateRole, db = this.drizzle.db) {
		return db.insert(rolesTable).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateRole, db = this.drizzle.db) {
		return db.update(rolesTable).set(data).where(eq(rolesTable.id, id)).returning().then(takeFirstOrThrow);
	}

	async delete(id: string, db = this.drizzle.db) {
		return db.delete(rolesTable).where(eq(rolesTable.id, id)).returning().then(takeFirstOrThrow);
	}
}
