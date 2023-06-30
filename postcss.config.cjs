const tailwindcss = require("tailwindcss");
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const atImport = require('postcss-import');

const config = {
	plugins: [
		tailwindcss(),
		atImport(),
		postcssPresetEnv({
			stage: 2,
			features: {
				'nesting-rules': true,
				'custom-media-queries': true,
				'media-query-ranges': true
			}
		})
	] //Some plugins, like tailwindcss/nesting, need to run before Tailwind, tailwindcss(), //But others, like autoprefixer, need to run after, autoprefixer]
};

module.exports = config;
