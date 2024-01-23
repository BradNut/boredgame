import type { RequestHandler } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";

export const GET: RequestHandler = async ({ request }) => {
	if (request?.headers?.get('Authorization') === `Bearer ${process.env.CRON_SECRET}`) {
		await lucia.deleteExpiredSessions();
		return new Response('Success', { status: 200 });
	} else {
		return new Response('Unauthorized', { status: 401 });
	}
}