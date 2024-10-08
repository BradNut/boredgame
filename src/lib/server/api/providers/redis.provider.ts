import RedisClient from 'ioredis'
import { container } from 'tsyringe'
import { config } from '../common/config'

export const RedisProvider = Symbol('REDIS_TOKEN')
export type RedisProvider = RedisClient

container.register<RedisProvider>(RedisProvider, {
	useValue: new RedisClient(config.redis.url, {
		maxRetriesPerRequest: null,
	}),
})
