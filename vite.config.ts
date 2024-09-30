// import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// TODO: Fix Sentry
export default defineConfig({
	plugins: [
		// sentrySvelteKit({
		// 	sourceMapsUploadOptions: {
		// 		org: process.env.SENTRY_ORG,
		// 		project: process.env.SENTRY_PROJECT,
		// 		authToken: process.env.SENTRY_AUTH_TOKEN,
		// 		cleanArtifacts: true,
		// 	}
		// }),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		mockReset: true,
	},
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			postcss: {
				additionalData: `
				@custom-media --below_small (width < 400px);
				@custom-media --below_med (width < 700px);
				@custom-media --below_large (width < 900px);
				@custom-media --below_xlarge (width < 1200px);

				@custom-media --above_small (width > 400px);
				@custom-media --above_med (width > 700px);
				@custom-media --above_large (width > 900px);
				@custom-media --above_xlarge (width > 1200px);
				`
			}
		}
	},
});
