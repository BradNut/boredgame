import { redirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const actions: Actions = {
	default: async ({ locals }) => {
		console.log('Signing out user');
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/login');
		}
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/');
	}
};
