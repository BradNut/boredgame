import {defineOpenApiOperation, type HonoOpenApiOperation, type HonoOpenApiRequestSchemas} from "hono-zod-openapi";

export const taggedAuthRoute = <T extends HonoOpenApiRequestSchemas>(
  tag: string,
  doc: HonoOpenApiOperation<T>,
) => {
  return defineOpenApiOperation({
    ...doc,
    tags: [tag],
    security: [{ cookieAuth: [] }],
  });
};
