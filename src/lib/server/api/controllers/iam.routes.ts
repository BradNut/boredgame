import { StatusCodes } from '$lib/constants/status-codes';
import { unauthorizedSchema } from '$lib/server/api/common/exceptions';
import { createAuthCookieSchema } from '$lib/server/api/common/openapi/create-cookie-schema';
import { selectUserSchema } from '$lib/server/api/databases/tables/users.table';
import { updateProfileDto } from '$lib/server/api/dtos/update-profile.dto';
import { z } from '@hono/zod-openapi';
import { defineOpenApiOperation } from 'hono-zod-openapi';
import { createErrorSchema } from 'stoker/openapi/schemas';

const tags = ['IAM'];

export const iam = defineOpenApiOperation({
	tags,
	responses: {
		[StatusCodes.OK]: {
			description: 'User profile',
			schema: selectUserSchema,
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});

export const updateProfile = defineOpenApiOperation({
	tags,
	security: [{ bearerAuth: [] }],
	request: {
		json: updateProfileDto,
	},
	responses: {
		[StatusCodes.OK]: {
			description: 'Updated User',
			schema: selectUserSchema,
			mediaType: 'application/json',
		},
		[StatusCodes.UNPROCESSABLE_ENTITY]: {
			description: 'The validation error(s)',
			schema: createErrorSchema(updateProfileDto),
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});
