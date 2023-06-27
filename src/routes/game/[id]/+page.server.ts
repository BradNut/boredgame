import { error } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';
import { boardGameApi } from '../../api';

export const load = async ({ params, setHeaders, locals }) => {
	try {
		const { user } = locals;
		const { id } = params;
		const game = await prisma.game.findUnique({
			where: {
				id
			}
		});
		console.log('found game', game);
		return {
			game,
			user
		};
	} catch (error) {
		console.log(error);
	}

	throw error(404, 'not found');
};
