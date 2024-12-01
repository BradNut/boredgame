import { config } from '$lib/server/api/common/config';
import { injectable } from '@needle-di/core';
import { Redis } from 'ioredis';

@injectable()
export class RedisService {
  readonly redis: Redis;

  constructor() {
    this.redis = new Redis(config.redis.url, {
      maxRetriesPerRequest: null,
    });
  }

  async get(data: { prefix: string; key: string }): Promise<string | null> {
    return this.redis.get(`${data.prefix}:${data.key}`);
  }

  async set(data: { prefix: string; key: string; value: string }): Promise<void> {
    await this.redis.set(`${data.prefix}:${data.key}`, data.value);
  }

  async delete(data: { prefix: string; key: string }): Promise<void> {
    await this.redis.del(`${data.prefix}:${data.key}`);
  }

  async setWithExpiry(data: {
    prefix: string;
    key: string;
    value: string;
    expiry: number;
  }): Promise<void> {
    await this.redis.set(`${data.prefix}:${data.key}`, data.value, 'EXAT', Math.floor(data.expiry));
  }
}
