import { FlatCompat } from '@eslint/eslintrc'
import { fixupPluginRules, fixupConfigRules } from '@eslint/compat'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginEslintStylistic from '@stylistic/eslint-plugin'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import pluginSortDestructureKeys from 'eslint-plugin-sort-destructure-keys'
import pluginSortKeysFix from 'eslint-plugin-sort-keys-fix'
import pluginTypeScriptSortKeys from 'eslint-plugin-typescript-sort-keys'
import globals from 'globals'

const __dirname = import.meta.dirname
const compat = new FlatCompat({ baseDirectory: __dirname })

const importRules = {
	'import/extensions': [
		'error',
		'always',
		{ js: 'ignorePackages', jsx: 'ignorePackages', ts: 'ignorePackages', tsx: 'ignorePackages' },
	],
	'import/no-cycle': 'off',
	'import/no-extraneous-dependencies': [
		'error',
		{ devDependencies: ['**/{development,test}.{js,ts}'] },
	],
	'import/order': [
		'warn',
		{
			alphabetize: { caseInsensitive: false, order: 'asc' },
			groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
			'newlines-between': 'always',
		},
	],
	'import/prefer-default-export': 'off',
}

const reactRules = {
	...pluginReactHooks.configs.recommended.rules,
	'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
	'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
	'react/jsx-props-no-spreading': [
		'error', { custom: 'ignore', exceptions: ['input'], explicitSpread: 'ignore', html: 'enforce' },
	],
	'react/jsx-sort-props': ['warn', { reservedFirst: true }],
	'react/require-default-props': ['error', { functions: 'ignore' }],
}

const jsxA11yRules = {
	'jsx-a11y/alt-text': 'warn',
	'jsx-a11y/anchor-is-valid': 'warn',
	'jsx-a11y/click-events-have-key-events': 'warn',
	'jsx-a11y/control-has-associated-label': 'warn',
	'jsx-a11y/iframe-has-title': 'warn',
	'jsx-a11y/label-has-associated-control': 'warn',
	'jsx-a11y/no-noninteractive-element-interactions': 'warn',
	'jsx-a11y/no-static-element-interactions': 'warn',
}

const commonEslintRules = {
	'arrow-body-style': 'off',
	'no-param-reassign': ['error', { props: false }],
	'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
	'no-restricted-imports': [
		'error', { patterns: [{ group: ['.*'], message: 'Use absolute imports instead.' }] },
	],
	'no-restricted-syntax': [
		'error',
		{
			message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
			selector: 'ForInStatement',
		},
		{
			message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
			selector: 'LabeledStatement',
		},
		{
			message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
			selector: 'WithStatement',
		},
	],
	'no-void': ['error', { allowAsStatement: true }],
	'sort-destructure-keys/sort-destructure-keys': ['warn', { caseSensitive: false }],
	'sort-keys-fix/sort-keys-fix': 'warn',
}

const eslintRules = {
	...commonEslintRules,

	'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
	'no-unused-vars': [
		'warn',
		{
			args: 'after-used',
			argsIgnorePattern: '^_',
			ignoreRestSiblings: false,
			vars: 'all',
			varsIgnorePattern: '^_',
		},
	],
	'no-use-before-define': 'off',
	'prefer-destructuring': ['error', { 'object': true, 'array': false }],
	'prefer-promise-reject-errors': ['error', { allowThrowingAny: true, allowThrowingUnknown: true }],
}

const typescriptEslintRules = {
	...commonEslintRules,

	'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
	'@typescript-eslint/naming-convention': [
		'error',
		{ selector: 'default', format: ['camelCase'] },
		{ selector: 'import', format: ['camelCase', 'PascalCase'] },
		{ selector: 'property', format: null, modifiers: ['requiresQuotes'] },
		{ selector: 'property', format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'] },
		{ selector: 'parameter', format: null, leadingUnderscore: 'allow', modifiers: ['unused'] },
		{ selector: 'variableLike', format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'] },
		{ selector: 'typeLike', format: ['PascalCase'] },
	],
	'@typescript-eslint/no-base-to-string': [
		'error',
		{ ignoredTypeNames: ['Error', 'RegExp', 'URL', 'URLSearchParams', 'Timeout'] },
	],
	'@typescript-eslint/no-explicit-any': 'warn',
	'@typescript-eslint/no-misused-promises': [
		'error', { checksVoidReturn: { arguments: false, attributes: false } },
	],
	'@typescript-eslint/no-unused-expressions': eslintRules['no-unused-expressions'],
	'@typescript-eslint/no-unused-vars': eslintRules['no-unused-vars'],
	'@typescript-eslint/no-use-before-define': eslintRules['no-use-before-define'],
	'@typescript-eslint/prefer-destructuring': eslintRules['prefer-destructuring'],
	'@typescript-eslint/prefer-nullish-coalescing': ['error', { ignorePrimitives: true }],
	'@typescript-eslint/prefer-promise-reject-errors': eslintRules['prefer-promise-reject-errors'],
}

const eslintStylisticRules = {
	'@stylistic/arrow-parens': ['error', 'always'],
	'@stylistic/brace-style': ['error', '1tbs'],
	'@stylistic/function-paren-newline': ['error', 'consistent'],
	'@stylistic/indent': ['error', 'tab'],
	'@stylistic/indent-binary-ops': ['error', 'tab'],
	'@stylistic/jsx-indent-props': ['error', 'tab'],
	'@stylistic/jsx-one-expression-per-line': ['error', { allow: 'non-jsx' }],
	'@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
	'@stylistic/max-len': [
		'error', 100, 2,
		{
			ignoreUrls: true,
			ignoreComments: true,
			ignoreRegExpLiterals: true,
			ignoreStrings: true,
			ignoreTemplateLiterals: true,
		},
	],
	'@stylistic/multiline-ternary': ['error', 'always-multiline', { ignoreJSX: true }],
	'@stylistic/no-tabs': 'off',
	'@stylistic/object-curly-newline': [
		'error',
		{
			ObjectExpression: { multiline: true, consistent: true },
			ObjectPattern: { multiline: true, consistent: true },
			ImportDeclaration: { multiline: true, consistent: true },
			ExportDeclaration: { multiline: true, consistent: true },
		},
	],
	'@stylistic/quote-props': ['error', 'as-needed'],
}

function margePluginsAndRules(configs) {
	return configs.reduce((obj, config) => {
		const { plugins, rules } = config

		return {
			plugins: { ...obj.plugins, ...plugins },
			rules: { ...obj.rules, ...rules },
		}
	}, {})
}

function extractRules(sourceRules, targetRules, prefix, searchWithPrefix = true) {
	const result = Object.entries(sourceRules).reduce(
		(acc, [sourceKey, value]) => {
			const { source, target } = acc

			if (targetRules[searchWithPrefix ? `${prefix}/${sourceKey}` : sourceKey]) {
				return {
					source: { ...source, [sourceKey]: 'off' },
					target: { ...target, [`${prefix}/${sourceKey}`]: value },
				}
			}

			return acc
		},
		{},
	)

	return { ...result.source, ...result.target }
}

const commonPlugins = {
	'sort-destructure-keys': pluginSortDestructureKeys,
	'sort-keys-fix': pluginSortKeysFix,
	'react-hooks': fixupPluginRules(pluginReactHooks),
}

const importRecommendedConfigs = fixupConfigRules(compat.extends('plugin:import/recommended'))
const importTypescriptConfigs = compat.extends('plugin:import/typescript')
const prettierOffRules = compat.extends('plugin:prettier/recommended')[0].rules
const airbnbRules = margePluginsAndRules(compat.extends('eslint-config-airbnb')).rules
const tsExtractedRules = extractRules(airbnbRules, tseslint.configs.all[2].rules, '@typescript-eslint')
const styleExtractedRules = extractRules(airbnbRules, pluginEslintStylistic.rules, '@stylistic', false)

const tsPluginsAndRules = margePluginsAndRules([
	eslint.configs.recommended,
	{ plugins: commonPlugins },
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	...compat.config(pluginTypeScriptSortKeys.configs.recommended),
	pluginReact.configs.flat.recommended,
	{ rules: { ...airbnbRules, ...tsExtractedRules, ...styleExtractedRules } },
	pluginReact.configs.flat['jsx-runtime'],
	pluginJsxA11y.flatConfigs.recommended,
	...importRecommendedConfigs,
	...importTypescriptConfigs,
	{
		rules: {
			...typescriptEslintRules,
			...importRules,
			...reactRules,
			...jsxA11yRules,
			...prettierOffRules,
			camelcase: 'off',
			'react/prop-types': 'off',
			'prefer-destructuring': 'off',
			'prefer-promise-reject-errors': 'off'
		},
	},
	pluginEslintStylistic.configs['recommended'],
	{ rules: eslintStylisticRules },
])

const jsPluginsAndRules = margePluginsAndRules([
	eslint.configs.recommended,
	{ plugins: commonPlugins },
	pluginReact.configs.flat.recommended,
	{ rules: { ...airbnbRules, ...styleExtractedRules } },
	pluginReact.configs.flat['jsx-runtime'],
	pluginJsxA11y.flatConfigs.recommended,
	...importRecommendedConfigs,
	{
		rules: {
			...eslintRules,
			...importRules,
			...reactRules,
			...jsxA11yRules,
			...prettierOffRules,
		},
	},
	pluginEslintStylistic.configs['recommended'],
	{ rules: eslintStylisticRules },
])

export default [
	{
		ignores: ['node_modules'],
		languageOptions: {
			ecmaVersion: 2024,
			globals: {
				...globals.node, ...globals.browser, ...globals.serviceworker, JSX: true, NodeJS: true,
			},
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: { jsx: true }, project: './tsconfig.eslint.json', tsconfigRootDir: __dirname,
			},
			sourceType: 'module',
		},
		settings: {
			'import/resolver': {
				typescript: { config: { resolve: { modules: ['app/javascript', 'node_modules'] } } },
			},
			react: { version: 'detect' },
		},
	},

	{ files: ['**/*.{ts,tsx}'], ...tsPluginsAndRules },
	{ files: ['**/*.{js,jsx}'], ...jsPluginsAndRules },
	{
		files: ['*.config.js', 'config/webpack/*.js'],
		plugins: jsPluginsAndRules.plugins,
		rules: {
			...jsPluginsAndRules.rules,
			'global-require': 'off',
			'import/no-dynamic-require': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/order': 'off',
			'no-console': 'off',
			'sort-destructure-keys/sort-destructure-keys': 'off',
			'sort-keys-fix/sort-keys-fix': 'off',
		},
	},
	{
		files: ['**/packs*/**/*.js'],
		plugins: jsPluginsAndRules.plugins,
		rules: { ...jsPluginsAndRules.rules, 'no-restricted-imports': 'off' },
	},
]
