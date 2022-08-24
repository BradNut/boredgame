import { api } from './_api';
import type { PageServerLoad, Action } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // locals.userid comes from src/hooks.js
  const response = await api('get', `todos/${locals.userid}`);

  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return {
  todos: []
};
  }

  if (response.status === 200) {
    return {
  todos: await response.json()
};
  }

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return {
    status: response.status
  };
};

export const POST: Action = async ({ request, locals }) => {
  const form = await request.formData();

  await api('post', `todos/${locals.userid}`, {
    text: form.get('text')
  });

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return {};
};

// If the user has JavaScript disabled, the URL will change to
// include the method override unless we redirect back to /todos
const redirect = {
  status: 303,
  headers: {
    location: '/todos'
  }
};

export const PATCH: Action = async ({ request, locals }) => {
  const form = await request.formData();

  await api('patch', `todos/${locals.userid}/${form.get('uid')}`, {
    text: form.has('text') ? form.get('text') : undefined,
    done: form.has('done') ? !!form.get('done') : undefined
  });

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return redirect;
};

export const DELETE: Action = async ({ request, locals }) => {
  const form = await request.formData();

  await api('delete', `todos/${locals.userid}/${form.get('uid')}`);

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return redirect;
};
