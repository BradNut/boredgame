import { StatusCodes } from '$lib/utils/status-codes';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export async function GET(event: RequestEvent): Promise<Response> {
  const { locals, url } = event;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  console.log('code', code, 'state', state);

  const { data, error } = await locals.api.oauth.google.$get({ query: { code, state } }).then(locals.parseApiResponse);

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 400,
    });
  }

  if (!data) {
    return new Response(JSON.stringify({ message: 'Invalid request' }), {
      status: 400,
    });
  }

  redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
}
