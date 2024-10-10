import { StatusCodes } from '$lib/constants/status-codes';
import { HTTPException } from 'hono/http-exception';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

export function TooManyRequests(message = 'Too many requests') {
	return new HTTPException(StatusCodes.TOO_MANY_REQUESTS, { message });
}

export const tooManyRequestsSchema = createMessageObjectSchema(HttpStatusPhrases.TOO_MANY_REQUESTS);

export function Forbidden(message = 'Forbidden') {
	return new HTTPException(StatusCodes.FORBIDDEN, { message });
}

export const forbiddenSchema = createMessageObjectSchema(HttpStatusPhrases.FORBIDDEN);

export function Unauthorized(message = 'Unauthorized') {
	return new HTTPException(StatusCodes.UNAUTHORIZED, { message });
}

export const unauthorizedSchema = createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED);

export function NotFound(message = 'Not Found') {
	return new HTTPException(StatusCodes.NOT_FOUND, { message });
}

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export function BadRequest(message = 'Bad Request') {
	return new HTTPException(StatusCodes.BAD_REQUEST, { message });
}

export const badRequestSchema = createMessageObjectSchema(HttpStatusPhrases.BAD_REQUEST);

export function InternalError(message = 'Internal Error') {
	return new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, { message });
}

export const internalErrorSchema = createMessageObjectSchema(HttpStatusPhrases.INTERNAL_SERVER_ERROR);
