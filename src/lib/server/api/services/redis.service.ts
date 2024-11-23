import {config} from '$lib/server/api/common/config'
import {Redis} from 'ioredis'
import { injectable} from '@needle-di/core';
import type {Disposable} from 'tsyringe';

@injectable()
export class RedisService implements Disposable {
  readonly client: Redis;

  constructor() {
    this.client = new Redis(config.redis.url, {
      maxRetriesPerRequest: null,
    });
  }

  async get(data: { prefix: string; key: string }): Promise<string | null> {
    return this.client.get(`${data.prefix}:${data.key}`);
  }

  async set(data: { prefix: string; key: string; value: string }): Promise<void> {
    await this.client.set(`${data.prefix}:${data.key}`, data.value);
  }

  async delete(data: { prefix: string; key: string }): Promise<void> {
    await this.client.del(`${data.prefix}:${data.key}`);
  }

  async setWithExpiry(data: {
    prefix: string;
    key: string;
    value: string;
    expiry: number;
  }): Promise<void> {
    await this.client.set(`${data.prefix}:${data.key}`, data.value, 'EXAT', Math.floor(data.expiry));
  }

  async dispose(): Promise<void> {
    this.client.disconnect();
  }
}
