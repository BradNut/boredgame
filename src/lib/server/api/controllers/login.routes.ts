import { defineOpenApiOperation } from "hono-zod-openapi";
import { StatusCodes } from '$lib/constants/status-codes';
import { signinUsernameDto } from "../dtos/signin-username.dto";
import { createErrorSchema } from "stoker/openapi/schemas";

export const signinUsername = defineOpenApiOperation({
	tags: ['Login'],
	summary: 'Sign in with username',
	description: 'Sign in with username',
	responses: {
		[StatusCodes.OK]: {
			description: 'Sign in with username',
			schema: signinUsernameDto,
		},
		[StatusCodes.UNPROCESSABLE_ENTITY]: {
			description: 'The validation error(s)',
			schema: createErrorSchema(signinUsernameDto),
			mediaType: 'application/json',
		}
	}
});
