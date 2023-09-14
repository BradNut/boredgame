import { superValidate } from 'sveltekit-superforms/server';
import { search_schema } from '$lib/zodValidation';
import type { MetaTagsProps } from 'svelte-meta-tags';

export const load = async ({ fetch, url }) => {
	const metaTags: MetaTagsProps = Object.freeze({
		title: 'Home',
		description: 'Home page',
		openGraph: {
			type: 'website',
			url: new URL(url.pathname, url.origin).href,
			locale: 'en_US',
			title: 'Home',
			description: 'Bored Game, keep track of your games'
		}
	});

	const formData = Object.fromEntries(url?.searchParams);
	console.log('formData', formData);
	formData.name = formData?.q;
	const form = await superValidate(formData, search_schema);
	console.log('form', form);
	return { form, metaTagsChild: metaTags };
};

// export const actions = {
// 	default: async ({ request, locals }): Promise<any> => {
// 		// Do things in here
// 		return {};
// 	}
// };
