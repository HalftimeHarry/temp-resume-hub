import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Set the edge option to false to use serverless functions
			// This might help with the static asset loading issue
			edge: false,
			split: false
		}),
		alias: {
			$lib: 'src/lib'
		},
		env: {
			publicPrefix: 'PUBLIC_'
		},
		paths: {
			base: '',
			relative: false
		}
	}
};

export default config;