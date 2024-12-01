import { StatusCodes } from '$lib/utils/status-codes';
import { defineOpenApiOperation } from 'hono-zod-openapi';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { signinUsernameDto } from '../dtos/signin-username.dto';

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
    },
  },
});
