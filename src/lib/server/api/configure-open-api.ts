// import type { AppOpenAPI } from '$lib/server/api/common/types/hono';
import { apiReference } from '@scalar/hono-api-reference';
import { Hono } from 'hono';

import type { AppOpenAPI } from '$lib/server/api/common/types/hono';
// import { createOpenApiDocument } from 'hono-zod-openapi';
import { createOpenApiDocument } from 'hono-zod-openapi';
import packageJSON from '../../../../package.json';

// export default function configureOpenAPI(app: AppOpenAPI) {
// 	app.doc('/doc', {
// 		openapi: '3.0.0',
// 		info: {
// 			title: 'Bored Game API',
// 			description: 'Bored Game API',
// 			version: packageJSON.version,
// 		},
// 	});
//
// 	app.get(
// 		'/reference',
// 		apiReference({
// 			theme: 'kepler',
// 			layout: 'classic',
// 			defaultHttpClient: {
// 				targetKey: 'javascript',
// 				clientKey: 'fetch',
// 			},
// 			spec: {
// 				url: '/api/doc',
// 			},
// 		}),
// 	);
// }

export default function configureOpenAPI(app: AppOpenAPI) {
	createOpenApiDocument(app, {
		info: {
			title: 'Bored Game API',
			description: 'Bored Game API',
			version: packageJSON.version,
		},
	});

	app.get(
		'/reference',
		apiReference({
			theme: 'kepler',
			layout: 'classic',
			defaultHttpClient: {
				targetKey: 'javascript',
				clientKey: 'fetch',
			},
			spec: {
				url: '/api/doc',
			},
		}),
	);
}
