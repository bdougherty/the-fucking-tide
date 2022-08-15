import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				// https://web.dev/strict-csp/
				'script-src': ['strict-dynamic', 'https:', 'unsafe-inline'],
				'object-src': ['none'],
				'base-uri': ['none']
			}
		}
	}
};

export default config;
