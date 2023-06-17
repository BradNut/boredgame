import { superValidate } from 'sveltekit-superforms/server';
import { search_schema } from '$lib/zodValidation';

export const load = async ({ fetch, url }) => {
	const formData = Object.fromEntries(url?.searchParams);
	console.log('formData', formData);
	formData.name = formData?.q;
	const form = await superValidate(formData, search_schema);
	console.log('form', form);
	return { form };
};

export const actions = {
	default: async ({ request, locals }): Promise<any> => {
		// Do things in here
		return {};
	}
};
