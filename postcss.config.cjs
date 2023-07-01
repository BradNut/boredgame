const tailwindcss = require("tailwindcss");
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const atImport = require('postcss-import');

const config = {
	plugins: [
		atImport(),
		// 'tailwindcss/nesting'(),
		tailwindcss(),
		postcssPresetEnv({
			stage: 2,
			features: {
				'nesting-rules': false,
				'custom-media-queries': true,
				'media-query-ranges': true
			}
		}),


	] //Some plugins, like tailwindcss/nesting, need to run before Tailwind, tailwindcss(), //But others, like autoprefixer, need to run after, autoprefixer]
};

module.exports = config;
