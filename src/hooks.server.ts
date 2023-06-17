import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type HandleServerError, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { auth } from '$lib/server/lucia';
import log from '$lib/server/log';
import prisma from '$lib/config/prisma';

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	event.locals.error = error?.toString() || undefined;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	event.locals.errorStackTrace = error?.stack || undefined;
	event.locals.errorId = errorId;
	if (!dev) {
		log(500, event);
	}

	return {
		message: 'An unexpected error occurred.',
		errorId
	};
};

// export const prismaClient: Handle = async function ({ event, resolve }) {
// 	event.locals.prisma = prisma;
// 	const response = await resolve(event);
// 	return response;
// };

export const authentication: Handle = async function ({ event, resolve }) {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;

	event.locals.auth = auth.handleRequest(event);
	if (event.locals?.auth) {
		const { user } = await event.locals.auth.validateUser();
		event.locals.user = user;
		// if (event.route.id?.startsWith('/(protected)')) {
		// if (!user) throw redirect(302, '/auth/sign-in');
		// if (!user.verified) throw redirect(302, '/auth/verify/email');
		// }
	}

	const response = await resolve(event);
	return response;
};

export const handle = sequence(authentication);
