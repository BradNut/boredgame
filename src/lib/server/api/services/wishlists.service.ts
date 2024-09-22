import type { db } from '$lib/server/api/packages/drizzle'
import { generateRandomAnimalName } from '$lib/utils/randomDataUtil'
import { inject, injectable } from 'tsyringe'
import { WishlistsRepository } from '../repositories/wishlists.repository'

@injectable()
export class WishlistsService {
	constructor(@inject(WishlistsRepository) private readonly wishlistsRepository: WishlistsRepository) {}

	async findAllByUserId(userId: string) {
		return this.wishlistsRepository.findAllByUserId(userId)
	}

	async findOneById(id: string) {
		return this.wishlistsRepository.findOneById(id)
	}

	async findOneByCuid(cuid: string) {
		return this.wishlistsRepository.findOneByCuid(cuid)
	}

	async createEmptyNoName(userId: string, trx: Parameters<Parameters<typeof db.transaction>[0]>[0] | null = null) {
		return this.createEmpty(userId, null, trx)
	}

	async createEmpty(userId: string, name: string | null, trx: Parameters<Parameters<typeof db.transaction>[0]>[0] | null = null) {
		if (!trx) {
			return this.wishlistsRepository.create({
				user_id: userId,
				name: name ?? generateRandomAnimalName(),
			})
		}
		return this.wishlistsRepository.create(
			{
				user_id: userId,
				name: name ?? generateRandomAnimalName(),
			},
			trx,
		)
	}
}
