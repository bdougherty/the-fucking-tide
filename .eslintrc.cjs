module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier', 'plugin:unicorn/recommended'],
	plugins: ['svelte3', 'unicorn'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'unicorn/no-null': 'off',
		'unicorn/numeric-separators-style': 'off',
		// not supported by vite or rollup
		'unicorn/prefer-node-protocol': 'off'
	}
};
