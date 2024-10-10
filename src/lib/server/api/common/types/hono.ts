import type { Hono } from 'hono';
import type { PinoLogger } from 'hono-pino';
import type { Promisify, RateLimitInfo } from 'hono-rate-limiter';
import type { Session, User } from 'lucia';

// export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppOpenAPI = Hono;

export type AppBindings = {
	Variables: {
		logger: PinoLogger;
		session: Session | null;
		user: User | null;
		rateLimit: RateLimitInfo;
		rateLimitStore: {
			getKey?: (key: string) => Promisify<RateLimitInfo | undefined>;
			resetKey: (key: string) => Promisify<void>;
		};
	};
};

export type HonoTypes = {
	Variables: {
		logger: PinoLogger;
		session: Session | null;
		user: User | null;
		rateLimit: RateLimitInfo;
		rateLimitStore: {
			getKey?: (key: string) => Promisify<RateLimitInfo | undefined>;
			resetKey: (key: string) => Promisify<void>;
		};
	};
};
