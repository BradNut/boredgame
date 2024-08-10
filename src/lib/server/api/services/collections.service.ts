import { inject, injectable } from "tsyringe";

@injectable()
export class CollectionsService {
	constructor(
		@inject(CollectionsRepository) private readonly collectionsRepository: CollectionsRepository
	) { }


}