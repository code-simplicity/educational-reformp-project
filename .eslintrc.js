module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'@vue/eslint-config-prettier'
	],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		parser: 'vue-eslint-parser'
	},
	plugins: ['vue', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'vue/multi-word-component-names': 'off',
		'vue/require-default-prop': 'off',
		'vue/no-v-html': 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
	}
};