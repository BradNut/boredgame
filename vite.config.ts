import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit(), paraglide({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide"
		}),
	],
	esbuild: {
		target: 'es2022',
	},
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
				`,
			},
		},
	},
});
