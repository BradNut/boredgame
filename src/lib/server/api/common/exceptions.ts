import { StatusCodes } from '$lib/constants/status-codes'
import { HTTPException } from 'hono/http-exception'

export function TooManyRequests(message = 'Too many requests') {
	return new HTTPException(StatusCodes.TOO_MANY_REQUESTS, { message })
}

export function Forbidden(message = 'Forbidden') {
	return new HTTPException(StatusCodes.FORBIDDEN, { message })
}

export function Unauthorized(message = 'Unauthorized') {
	return new HTTPException(StatusCodes.UNAUTHORIZED, { message })
}

export function NotFound(message = 'Not Found') {
	return new HTTPException(StatusCodes.NOT_FOUND, { message })
}

export function BadRequest(message = 'Bad Request') {
	return new HTTPException(StatusCodes.BAD_REQUEST, { message })
}

export function InternalError(message = 'Internal Error') {
	return new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, { message })
}
