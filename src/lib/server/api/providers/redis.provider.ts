import RedisClient from 'ioredis'
import { container } from 'tsyringe'
import { config } from '../configs/config'

export const RedisProvider = Symbol('REDIS_TOKEN')
export type RedisProvider = RedisClient
container.register<RedisProvider>(RedisProvider, {
	useValue: new RedisClient(config.REDIS_URL, {
		maxRetriesPerRequest: null,
	}),
})
