import {inject, injectable} from "tsyringe";
import {DatabaseProvider} from "$lib/server/api/providers";

@injectable()
export class CollectionsRepository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) { }

	async findAll() {
		return db.query.collections.findMany();
	}
}