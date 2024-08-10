import {inject, injectable} from "tsyringe";
import {DatabaseProvider} from "$lib/server/api/providers";

@injectable()
export class CollectionsService {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) { }

	
}