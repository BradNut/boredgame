import { z } from '@hono/zod-openapi';

export const authCookieSchema = z.string().regex(/^session=\w+$/);
