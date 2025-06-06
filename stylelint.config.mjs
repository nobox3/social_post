export default {
	extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
	overrides: [
		{
			files: ['**/*.{jsx,tsx}'],
			customSyntax: 'postcss-styled-syntax',
		},
	],
	ignoreFiles: ['**/node_modules/**'],
	rules: {
		'selector-class-pattern': null,
		'scss/operator-no-unspaced': null,
	},
}
