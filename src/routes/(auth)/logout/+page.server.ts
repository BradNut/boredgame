import { redirect, type Actions } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		console.log('Signing out user');
		const sessionId = cookies.get(lucia.sessionCookieName);
		if (!locals.user || !sessionId) {
			throw redirect(302, '/login');
		}
		await lucia.invalidateSession(sessionId);
		// locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/');
	}
};
