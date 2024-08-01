import { and, eq, type InferInsertModel } from "drizzle-orm";
import { credentialsTable, CredentialsType } from "../infrastructure/database/tables/credentials.table";
import { db } from "../infrastructure/database";
import { takeFirstOrThrow } from "../infrastructure/database/utils";

export type CreateCredentials = InferInsertModel<typeof credentialsTable>;
export type UpdateCredentials = Partial<CreateCredentials>;

export class CredentialsRepository {

	async findOneByUserId(userId: string) {
		return db.query.credentialsTable.findFirst({
			where: eq(credentialsTable.user_id, userId)
		});
	}

	async findPasswordCredentialsByUserId(userId: string) {
		return db.query.credentialsTable.findFirst({
			where: and(
				eq(credentialsTable.user_id, userId),
				eq(credentialsTable.type, CredentialsType.PASSWORD)
			)
		});
	}

	async findTOTPCredentialsByUserId(userId: string) {
		return db.query.credentialsTable.findFirst({
			where: and(
				eq(credentialsTable.user_id, userId),
				eq(credentialsTable.type, CredentialsType.TOTP)
			)
		});
	}

	async findOneById(id: string) {
		return db.query.credentialsTable.findFirst({
			where: eq(credentialsTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string) {
		const credentials = await this.findOneById(id);
		if (!credentials) throw Error('Credentials not found');
		return credentials;
	}

	async create(data: CreateCredentials) {
		return db.insert(credentialsTable).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateCredentials) {
		return db
			.update(credentialsTable)
			.set(data)
			.where(eq(credentialsTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}
}