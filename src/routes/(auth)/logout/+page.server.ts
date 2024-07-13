import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { lucia } from '$lib/server/auth';
import { signedOutMessage } from '$lib/flashMessages';
import type { Actions } from "./$types";

export const actions: Actions = {
	default: async (event) => {
		const { locals, cookies } = event;
		console.log('Signing out user');
		if (!locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return redirect(302, '/login', signedOutMessage, event);
	}
};
