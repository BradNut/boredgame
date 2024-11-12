import {type Processor, Queue, Worker} from 'bullmq'
import RedisClient from 'ioredis';
import { config } from "../common/config";
import { injectable } from '@needle-di/core';

@injectable()
export class JobsService {
	constructor() { }

	createQueue(name: string) {
		return new Queue(name, {
			connection: new RedisClient(config.redis.url, {
				maxRetriesPerRequest: null,
			})
		})
	}

	createWorker(name: string, processor: Processor) {
		return new Worker(name, processor, {
			connection: new RedisClient(config.redis.url, {
				maxRetriesPerRequest: null,
			})
		})
	}
}
