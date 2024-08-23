import { inject, injectable } from "tsyringe";
import { WishlistsRepository } from "../repositories/wishlists.repository";
import { generateRandomAnimalName } from "$lib/utils/randomDataUtil";

@injectable()
export class WishlistsService {

	constructor(
		@inject(WishlistsRepository) private readonly wishlistsRepository: WishlistsRepository
	) { }

	async findAllByUserId(userId: string) {
		return this.wishlistsRepository.findAllByUserId(userId);
	}

	async findOneById(id: string) {
		return this.wishlistsRepository.findOneById(id);
	}

	async findOneByCuid(cuid: string) {
		return this.wishlistsRepository.findOneByCuid(cuid);
	}

	async createEmptyNoName(userId: string) {
		return this.createEmpty(userId, null);
	}

	async createEmpty(userId: string, name: string | null) {
		return this.wishlistsRepository.create({
			user_id: userId,
			name: name ?? generateRandomAnimalName(),
		});
	}
}