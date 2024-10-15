import { StatusCodes } from '$lib/constants/status-codes';
import { unauthorizedSchema } from '$lib/server/api/common/exceptions';
import cuidParamsSchema from '$lib/server/api/common/openapi/cuidParamsSchema';
import { selectCollectionSchema } from '$lib/server/api/databases/tables';
import { z } from '@hono/zod-openapi';
import { IdParamsSchema } from 'stoker/openapi/schemas';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { taggedAuthRoute } from '../common/openapi/create-auth-route';

const tag = 'Collection';

export const allCollections = taggedAuthRoute(tag, {
	responses: {
		[StatusCodes.OK]: {
			description: 'User profile',
			schema: selectCollectionSchema,
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});

export const numberOfCollections = taggedAuthRoute(tag, {
	responses: {
		[StatusCodes.OK]: {
			description: 'User profile',
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});

export const getCollectionByCUID = taggedAuthRoute(tag, {
	request: {
		param: {
			schema: cuidParamsSchema,
			example: { cuid: 'z6uiuc9qz82xjf5dexc5kr2d' },
		},
	},
	responses: {
		[StatusCodes.OK]: {
			description: 'User profile',
			schema: selectCollectionSchema,
			mediaType: 'application/json',
		},
		[StatusCodes.NOT_FOUND]: {
			description: 'The collection does not exist',
			schema: z.object({ message: z.string() }).openapi({
				example: {
					message: 'The collection does not exist',
				},
			}),
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});
