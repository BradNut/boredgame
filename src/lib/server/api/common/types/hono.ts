import type { Users } from '$lib/server/api/databases/postgres/tables';
import type { Session } from '$lib/server/api/iam/sessions/sessions.service';
import type { Hono } from 'hono';
import type { PinoLogger } from 'hono-pino';
import type { Promisify, RateLimitInfo } from 'hono-rate-limiter';

// export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppOpenAPI = Hono<AppBindings>;

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
    session: Session | null;
    user: Users | null;
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
    user: Users | null;
    rateLimit: RateLimitInfo;
    rateLimitStore: {
      getKey?: (key: string) => Promisify<RateLimitInfo | undefined>;
      resetKey: (key: string) => Promisify<void>;
    };
  };
};
