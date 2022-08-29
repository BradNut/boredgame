/*
  This module is used by the /todos endpoint to
  make calls to api.svelte.dev, which stores todos
  for each user. The leading underscore indicates that this is
  a private module, _not_ an endpoint — visiting /todos/_api
  will net you a 404 response.

  (The data on the todo app will expire periodically; no
  guarantees are made. Don't use it to organize your life.)
*/

import { URLSearchParams } from 'url';

const base = 'https://api.boardgameatlas.com/api';

export function boardGameApi(
  method: string,
  resource: string,
  queryParams: Record<string, string>,
  data?: Record<string, unknown>
) {
  console.log('queryParams', queryParams);
  queryParams.client_id = import.meta.env.VITE_PUBLIC_CLIENT_ID;
  const urlQueryParams = new URLSearchParams(queryParams);
  const url = `${base}/${resource}${urlQueryParams ? `?${urlQueryParams}` : ''}`;
  return fetch(url, {
    method,
    headers: {
      'content-type': 'application/json'
    },
    body: data && JSON.stringify(data)
  });
}
