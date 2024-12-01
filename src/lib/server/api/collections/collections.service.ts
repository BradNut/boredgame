import type { db } from '$lib/server/api/packages/drizzle';
import { generateRandomAnimalName } from '$lib/utils/randomDataUtil';
import { inject, injectable } from '@needle-di/core';
import { CollectionsRepository } from './collections.repository';

@injectable()
export class CollectionsService {
  constructor(private collectionsRepository = inject(CollectionsRepository)) {}

  async findOneByUserId(userId: string) {
    return this.collectionsRepository.findOneByUserId(userId);
  }

  async findAllByUserId(userId: string) {
    return this.collectionsRepository.findAllByUserId(userId);
  }

  async findAllByUserIdWithDetails(userId: string) {
    return this.collectionsRepository.findAllByUserIdWithDetails(userId);
  }

  async findOneById(id: string) {
    return this.collectionsRepository.findOneById(id);
  }

  async findOneByCuid(cuid: string) {
    return this.collectionsRepository.findOneByCuid(cuid);
  }

  async createEmptyNoName(userId: string, trx: Parameters<Parameters<typeof db.transaction>[0]>[0] | null = null) {
    return this.createEmpty(userId, null, trx);
  }

  async createEmpty(userId: string, name: string | null, trx: Parameters<Parameters<typeof db.transaction>[0]>[0] | null = null) {
    if (!trx) {
      return this.collectionsRepository.create({
        user_id: userId,
        name: name ?? generateRandomAnimalName(),
      });
    }

    return this.collectionsRepository.create(
      {
        user_id: userId,
        name: name ?? generateRandomAnimalName(),
      },
      trx,
    );
  }
}
