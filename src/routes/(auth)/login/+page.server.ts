import { fail, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import prisma from '$lib/prisma';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';
import type { PageServerLoad } from './$types';

const signInSchema = userSchema.pick({
	username: true,
	password: true
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, signInSchema);
	try {
		console.log('login load event', event);
		const session = await event.locals.auth.validate();
		if (session) {
			const message = { type: 'info', message: 'You are already signed in' };
			throw redirect('/', message, event);
		}
		return {
			form
		};
	} catch (e) {
		fail(500, {
			form
		});
	}
};

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event;
		const form = await superValidate(event, signInSchema);

		if (!form.valid) {
			form.data.password = '';
			return fail(400, {
				form
			});
		}

		try {
			const key = await auth.useKey('username', form.data.username, form.data.password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);

			const user = await prisma.user.findUnique({
				where: {
					id: session.user.userId
				},
				include: {
					roles: {
						select: {
							role: true
						}
					}
				}
			});
			if (user) {
				await prisma.collection.upsert({
					where: {
						user_id: user.id
					},
					create: {
						user_id: user.id
					},
					update: {
						user_id: user.id
					}
				});
				await prisma.wishlist.upsert({
					where: {
						user_id: user.id
					},
					create: {
						user_id: user.id
					},
					update: {
						user_id: user.id
					}
				});
			}
		} catch (e) {
			// TODO: need to return error message to the client
			console.error(e);
			form.data.password = '';
			return setError(form, '', 'Your username or password is incorrect.');
		}
		form.data.username = '';
		form.data.password = '';
		const message = { type: 'success', message: 'Signed In!' };
		// return { form, message };
		throw redirect('/', message, event);
	}
};
