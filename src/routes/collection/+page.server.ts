// import { redirect } from '@sveltejs/kit';
// import { superValidate } from 'sveltekit-superforms/server';
// import { search_schema } from '$lib/zodValidation';

export const load = async ({ fetch, url, locals }) => {
	// const session = await locals.auth.validate();
	// if (!session) {
	// throw redirect(302, '/auth/signin');
	// }

	console.log('locals load', locals);
	// const searchParams = Object.fromEntries(url?.searchParams);
	// const q = searchParams?.q;
	// const limit = parseInt(searchParams?.limit) || 10;
	// const skip = parseInt(searchParams?.skip) || 0;

	// const searchData = {
	// 	q,
	// 	limit,
	// 	skip
	// };

	// const form = await superValidate(searchData, search_schema);

	try {
		// let collection = await locals.prisma.collection.findUnique({
		// 	where: {
		// 		user_id: session.userId
		// 	}
		// 	include: {
		// 		collectionItems: {
		// 			where: {
		// 				title: {
		// 					contains: q,
		// 					mode: 'insensitive'
		// 				}
		// 			},
		// 			take: limit,
		// 			skip
		// 		}
		// 	}
		// });

		// console.log('collection', collection);
		// if (!collection) {
		// 	collection = await locals.prisma.collection.create({
		// 		data: {
		// 			user_id: session.userId
		// 		}
		// 	});
		// }

		return {
			// form,
			// collection
		};
	} catch (e) {
		console.error(e);
	}

	return {
		// form,
		// collection: []
	};
};
