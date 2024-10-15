import { StatusCodes } from '$lib/constants/status-codes';
import { unauthorizedSchema } from '$lib/server/api/common/exceptions';
import { selectUserSchema } from '$lib/server/api/databases/tables/users.table';
import { updateProfileDto } from '$lib/server/api/dtos/update-profile.dto';
import { createErrorSchema } from 'stoker/openapi/schemas';
import { taggedAuthRoute } from '../common/openapi/create-auth-route';
import { changePasswordDto } from '../dtos/change-password.dto';
import { verifyPasswordDto } from '../dtos/verify-password.dto';

const tag = 'IAM';

export const iam = taggedAuthRoute(tag, {
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

export const updateProfile = taggedAuthRoute(tag, {
	request: {
		json: updateProfileDto,
	},
	responses: {
		[StatusCodes.OK]: {
			description: 'Updated User',
			schema: selectUserSchema,
			mediaType: 'application/json',
		},
		[StatusCodes.BAD_REQUEST]: {
			description: 'The validation error(s)',
			schema: createErrorSchema(updateProfileDto),
			mediaType: 'application/json',
		},
		[StatusCodes.UNPROCESSABLE_ENTITY]: {
			description: 'Username already in use',
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});

export const verifyPassword = taggedAuthRoute(tag, {
	request: {
		json: verifyPasswordDto,
	},
	responses: {
		[StatusCodes.OK]: {
			description: 'Password verified',
			mediaType: 'application/json',
		},
		[StatusCodes.BAD_REQUEST]: {
			description: 'The validation error(s)',
			schema: createErrorSchema(verifyPasswordDto),
			mediaType: 'application/json',
		},
		[StatusCodes.UNPROCESSABLE_ENTITY]: {
			description: 'Incorrect password',
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});

export const updatePassword = taggedAuthRoute(tag, {
	request: {
		json: changePasswordDto,
	},
	responses: {
		[StatusCodes.OK]: {
			description: 'Password updated',
			mediaType: 'application/json',
		},
		[StatusCodes.BAD_REQUEST]: {
			description: 'The validation error(s)',
			schema: createErrorSchema(changePasswordDto),
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
		[StatusCodes.FORBIDDEN]: {
			description: 'Incorrect password',
			mediaType: 'application/json',
		},
		[StatusCodes.INTERNAL_SERVER_ERROR]: {
			description: 'Error updating password',
			mediaType: 'application/json',
		},
	},
});

export const updateEmail = taggedAuthRoute(tag, {
	responses: {
		[StatusCodes.OK]: {
			description: 'Email updated',
			mediaType: 'application/json',
		},
		[StatusCodes.BAD_REQUEST]: {
			description: 'The validation error(s)',
			schema: createErrorSchema(changePasswordDto),
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
		[StatusCodes.FORBIDDEN]: {
			description: 'Cannot change email address',
			mediaType: 'application/json',
		},
	},
});

export const logout = taggedAuthRoute(tag, {
	responses: {
		[StatusCodes.OK]: {
			description: 'Logged out',
			mediaType: 'application/json',
		},
		[StatusCodes.UNAUTHORIZED]: {
			description: 'Unauthorized',
			schema: createErrorSchema(unauthorizedSchema),
			mediaType: 'application/json',
		},
	},
});
