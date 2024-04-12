// vite.config.ts
import { sveltekit } from "file:///home/bshellnu/projects/websites/boredgame/node_modules/.pnpm/@sveltejs+kit@2.5.4_@sveltejs+vite-plugin-svelte@3.0.2_svelte@4.2.12_vite@5.2.6/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig } from "file:///home/bshellnu/projects/websites/boredgame/node_modules/.pnpm/vite@5.2.6_@types+node@20.11.30_sass@1.72.0/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
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
    include: ["src/**/*.{test,spec}.{js,ts}"]
  },
  define: {
    SUPERFORMS_LEGACY: true
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
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9ic2hlbGxudS9wcm9qZWN0cy93ZWJzaXRlcy9ib3JlZGdhbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2JzaGVsbG51L3Byb2plY3RzL3dlYnNpdGVzL2JvcmVkZ2FtZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9ic2hlbGxudS9wcm9qZWN0cy93ZWJzaXRlcy9ib3JlZGdhbWUvdml0ZS5jb25maWcudHNcIjsvLyBpbXBvcnQgeyBzZW50cnlTdmVsdGVLaXQgfSBmcm9tIFwiQHNlbnRyeS9zdmVsdGVraXRcIjtcbmltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuLy8gVE9ETzogRml4IFNlbnRyeVxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdC8vIHNlbnRyeVN2ZWx0ZUtpdCh7XG5cdFx0Ly8gXHRzb3VyY2VNYXBzVXBsb2FkT3B0aW9uczoge1xuXHRcdC8vIFx0XHRvcmc6IHByb2Nlc3MuZW52LlNFTlRSWV9PUkcsXG5cdFx0Ly8gXHRcdHByb2plY3Q6IHByb2Nlc3MuZW52LlNFTlRSWV9QUk9KRUNULFxuXHRcdC8vIFx0XHRhdXRoVG9rZW46IHByb2Nlc3MuZW52LlNFTlRSWV9BVVRIX1RPS0VOLFxuXHRcdC8vIFx0XHRjbGVhbkFydGlmYWN0czogdHJ1ZSxcblx0XHQvLyBcdH1cblx0XHQvLyB9KSxcblx0XHRzdmVsdGVraXQoKVxuXHRdLFxuXHR0ZXN0OiB7XG5cdFx0aW5jbHVkZTogWydzcmMvKiovKi57dGVzdCxzcGVjfS57anMsdHN9J11cblx0fSxcblx0ZGVmaW5lOiB7XG5cdFx0U1VQRVJGT1JNU19MRUdBQ1k6IHRydWVcblx0fSxcblx0Y3NzOiB7XG5cdFx0ZGV2U291cmNlbWFwOiB0cnVlLFxuXHRcdHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcblx0XHRcdHBvc3Rjc3M6IHtcblx0XHRcdFx0YWRkaXRpb25hbERhdGE6IGBcblx0XHRcdFx0QGN1c3RvbS1tZWRpYSAtLWJlbG93X3NtYWxsICh3aWR0aCA8IDQwMHB4KTtcblx0XHRcdFx0QGN1c3RvbS1tZWRpYSAtLWJlbG93X21lZCAod2lkdGggPCA3MDBweCk7XG5cdFx0XHRcdEBjdXN0b20tbWVkaWEgLS1iZWxvd19sYXJnZSAod2lkdGggPCA5MDBweCk7XG5cdFx0XHRcdEBjdXN0b20tbWVkaWEgLS1iZWxvd194bGFyZ2UgKHdpZHRoIDwgMTIwMHB4KTtcblxuXHRcdFx0XHRAY3VzdG9tLW1lZGlhIC0tYWJvdmVfc21hbGwgKHdpZHRoID4gNDAwcHgpO1xuXHRcdFx0XHRAY3VzdG9tLW1lZGlhIC0tYWJvdmVfbWVkICh3aWR0aCA+IDcwMHB4KTtcblx0XHRcdFx0QGN1c3RvbS1tZWRpYSAtLWFib3ZlX2xhcmdlICh3aWR0aCA+IDkwMHB4KTtcblx0XHRcdFx0QGN1c3RvbS1tZWRpYSAtLWFib3ZlX3hsYXJnZSAod2lkdGggPiAxMjAwcHgpO1xuXHRcdFx0XHRgXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxpQkFBaUI7QUFDMUIsU0FBUyxvQkFBb0I7QUFHN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVNSLFVBQVU7QUFBQSxFQUNYO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDTCxTQUFTLENBQUMsOEJBQThCO0FBQUEsRUFDekM7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNQLG1CQUFtQjtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSixjQUFjO0FBQUEsSUFDZCxxQkFBcUI7QUFBQSxNQUNwQixTQUFTO0FBQUEsUUFDUixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BV2pCO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
