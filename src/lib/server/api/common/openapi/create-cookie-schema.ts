import { authCookieSchema } from '$lib/server/api/common/openapi/schemas';
import { z } from '@hono/zod-openapi';

export type ZodSchema = z.ZodUnion<never> | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
type ZodString = z.ZodString;

export function createAuthCookieSchema() {
	return createCookieSchema(authCookieSchema);
}

export function createCookieSchema<T extends ZodSchema>(schema: ZodString) {
	return z.object({
		cookie: schema,
	});
}
