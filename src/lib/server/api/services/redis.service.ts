import { config } from '$lib/server/api/common/config'
import { Redis } from 'ioredis'
import { type Disposable, injectable } from 'tsyringe'

@injectable()
export class RedisService implements Disposable {
	readonly client: Redis

	constructor() {
		this.client = new Redis(config.redis.url, {
			maxRetriesPerRequest: null,
		})
	}

	async dispose(): Promise<void> {
		this.client.disconnect()
	}
}
