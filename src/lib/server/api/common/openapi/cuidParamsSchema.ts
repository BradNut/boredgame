import { z } from '@hono/zod-openapi';

const cuidParamsSchema = z.object({
	cuid: z.string().cuid2(),
});

export default cuidParamsSchema;
