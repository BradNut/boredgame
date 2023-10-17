import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { redirect } from 'sveltekit-flash-message/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/config/zod-schemas';

const signInSchema = userSchema.pick({
	username: true,
	password: true
});

export const load = async (event) => {
	console.log('login load event', event);
	const session = await event.locals.auth.validate();
	if (session) {
		const message = { type: 'info', message: 'You are already signed in' };
		throw redirect('/', message, event);
	}
	const form = await superValidate(event, signInSchema);
	return {
		form
	};
};

export const actions = {
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

			const user = await locals.prisma.user.findUnique({
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
				await locals.prisma.collection.upsert({
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
				await locals.prisma.wishlist.upsert({
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
