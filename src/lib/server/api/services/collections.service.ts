import { inject, injectable } from "tsyringe";
import { generateRandomAnimalName } from "$lib/utils/randomDataUtil";
import { CollectionsRepository } from "../repositories/collections.repository";

@injectable()
export class CollectionsService {
	constructor(
		@inject(CollectionsRepository) private readonly collectionsRepository: CollectionsRepository
	) { }

	async findOneByUserId(userId: string) {
		return this.collectionsRepository.findOneByUserId(userId);
	}

	async findAllByUserId(userId: string) {
		return this.collectionsRepository.findAllByUserId(userId);
	}

	async findOneById(id: string) {
		return this.collectionsRepository.findOneById(id);
	}

	async findOneByCuid(cuid: string) {
		return this.collectionsRepository.findOneByCuid(cuid);
	}

	async createEmptyNoName(userId: string) {
		return this.createEmpty(userId, null);
	}

	async createEmpty(userId: string, name: string | null) {
		return this.collectionsRepository.create({
			user_id: userId,
			name: name ?? generateRandomAnimalName(),
		});
	}
}