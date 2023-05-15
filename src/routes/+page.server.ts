import { superValidate } from 'sveltekit-superforms/server';
import { search_schema } from '$lib/zodValidation';

export const load = async ({ fetch, url }) => {
	const formData = Object.fromEntries(url?.searchParams);
	formData.name = formData?.q;
	const form = await superValidate(formData, search_schema);
	return { form };
};

export const actions = {
	default: async ({ request, locals }): Promise<any> => {
		// Do things in here
		return {};
	}
};
