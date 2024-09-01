import { RedisProvider } from '$lib/server/api/providers/redis.provider'
import { type Processor, Queue, Worker } from 'bullmq'
import { inject, injectable } from 'tsyringe'

@injectable()
export class JobsService {
	constructor(@inject(RedisProvider) private readonly redis: RedisProvider) {}

	createQueue(name: string) {
		return new Queue(name, { connection: this.redis })
	}

	createWorker(name: string, processor: Processor) {
		return new Worker(name, processor, { connection: this.redis })
	}
}
