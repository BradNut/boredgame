import { redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from "../$types";
import { BggForm } from "$lib/zodValidation";

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/login');
	}

	const form = await superValidate({}, zod(BggForm));

	return { form };
}