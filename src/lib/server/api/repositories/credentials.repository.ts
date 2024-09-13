import 'reflect-metadata'
import { CredentialsType, credentialsTable } from '$lib/server/api/databases/tables/credentials.table'
import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type InferInsertModel, and, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository'

export type CreateCredentials = InferInsertModel<typeof credentialsTable>
export type UpdateCredentials = Partial<CreateCredentials>
export type DeleteCredentials = Pick<CreateCredentials, 'id'>

@injectable()
export class CredentialsRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async findOneByUserId(userId: string, db = this.drizzle.db) {
		return db.query.credentialsTable.findFirst({
			where: eq(credentialsTable.user_id, userId),
		})
	}

	async findOneByUserIdAndType(userId: string, type: CredentialsType, db = this.drizzle.db) {
		return db.query.credentialsTable.findFirst({
			where: and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, type)),
		})
	}

	async findPasswordCredentialsByUserId(userId: string, db = this.drizzle.db) {
		return db.query.credentialsTable.findFirst({
			where: and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, CredentialsType.PASSWORD)),
		})
	}

	async findTOTPCredentialsByUserId(userId: string, db = this.drizzle.db) {
		return db.query.credentialsTable.findFirst({
			where: and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, CredentialsType.TOTP)),
		})
	}

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.credentialsTable.findFirst({
			where: eq(credentialsTable.id, id),
		})
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const credentials = await this.findOneById(id)
		if (!credentials) throw Error('Credentials not found')
		return credentials
	}

	async create(data: CreateCredentials, db = this.drizzle.db) {
		return db.insert(credentialsTable).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateCredentials, db = this.drizzle.db) {
		return db.update(credentialsTable).set(data).where(eq(credentialsTable.id, id)).returning().then(takeFirstOrThrow)
	}

	async delete(id: string, db = this.drizzle.db) {
		return db.delete(credentialsTable).where(eq(credentialsTable.id, id))
	}

	async deleteByUserId(userId: string, db = this.drizzle.db) {
		return db.delete(credentialsTable).where(eq(credentialsTable.user_id, userId))
	}

	async deleteByUserIdAndType(userId: string, type: CredentialsType, db = this.drizzle.db) {
		return db.delete(credentialsTable).where(and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, type)))
	}
}
