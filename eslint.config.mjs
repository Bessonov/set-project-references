import pluginImport from 'eslint-plugin-import'
import {
	defineConfig,
} from 'eslint/config'
import tseslint from 'typescript-eslint'

const config = {
	linterOptions: {
		reportUnusedDisableDirectives: 'error',
		reportUnusedInlineConfigs: 'error',
	},
	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			project: [
				'./tsconfig.eslint.json',
				'./tsconfig.json',
			],
			ecmaVersion: 2018,
			sourceType: 'module',
			ecmaFeatures: {
				jsx: true,
				generators: false,
				objectLiteralDuplicateProperties: false,
			},
		},
		globals: {
			BigInt: 'readonly',
		},
	},
	plugins: {
		import: pluginImport,
		'@typescript-eslint': tseslint.plugin,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
			},
		},
		'import/core-modules': [],
		'import/ignore': [
			'node_modules',
			'\\.(coffee|scss|css|less|hbs|svg|json)$',
		],
	},
	rules: {
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/switch-exhaustiveness-check': [
			'error',
		],
		'@typescript-eslint/no-use-before-define': [
			'error',
			{
				functions: false,
			},
		],
		'@typescript-eslint/no-explicit-any': [
			'error',
		],
		'@typescript-eslint/ban-ts-comment': [
			'off',
			{
				'ts-expect-error': 'allow-with-description',
				'ts-ignore': 'allow-with-description',
				'ts-nocheck': 'allow-with-description',
				'ts-check': 'allow-with-description',
				minimumDescriptionLength: 3,
			},
		],
		'@typescript-eslint/no-floating-promises': [
			'error',
		],
		'@typescript-eslint/adjacent-overload-signatures': [
			'error',
		],
		'@typescript-eslint/no-restricted-types': [
			'error',
		],
		'@typescript-eslint/no-empty-object-type': [
			'error',
		],
		'@typescript-eslint/no-unsafe-function-type': [
			'error',
		],
		'@typescript-eslint/no-wrapper-object-types': [
			'error',
		],
		'@typescript-eslint/no-array-constructor': [
			'error',
		],
		'@typescript-eslint/no-extra-non-null-assertion': [
			'error',
		],
		'@typescript-eslint/no-non-null-asserted-optional-chain': [
			'error',
		],
		'@typescript-eslint/no-non-null-assertion': [
			'error',
		],
		'@typescript-eslint/no-loss-of-precision': [
			'error',
		],
		'@typescript-eslint/no-misused-new': [
			'error',
		],
		'@typescript-eslint/no-namespace': [
			'error',
		],
		'@typescript-eslint/no-this-alias': [
			'error',
		],
		'import/no-default-export': [
			'error',
		],
		'import/no-named-as-default': [
			'error',
		],
		'import/no-named-as-default-member': [
			'error',
		],
		'import/export': [
			'error',
		],
		'import/no-absolute-path': [
			'error',
		],
		'import/no-dynamic-require': [
			'error',
		],
		'import/no-cycle': [
			'error',
			{
				maxDepth: '∞',
				ignoreExternal: false,
				allowUnsafeDynamicCyclicDependency: false,
			},
		],
		'import/no-extraneous-dependencies': [
			'off',
			{
				devDependencies: [
					'**/*Page.ts',
					'**/*.test.ts',
					'packages/frontend/src/playwright/**',
				],
			},
		],
		'import/extensions': [
			'error',
			'always',
			{
				ignorePackages: true,
			},
		],
		camelcase: [
			'error',
			{
				allow: [
					// // modules
					// 'async_hooks',
					// // db
					// 'query_timeout',
					// 'application_name',
				],
			},
		],
		eqeqeq: [
			'error',
			'always',
		],
		'func-names': [
			'error',
		],
		'func-style': [
			'error',
			'declaration',
			{
				allowArrowFunctions: true,
			},
		],
		// deactivated, because often `handler: function logoutSuccess() {` makes sense
		// 'func-name-matching': [
		// 	'error',
		// 	'always',
		// ],
		'guard-for-in': [
			'error',
		],
		'new-cap': [
			'error',
			// {
			//   "newIsCap": true,
			//   "newIsCapExceptions": [],
			//   "capIsNew": false,
			//   "capIsNewExceptions": [
			//     "Immutable.Map",
			//     "Immutable.Set",
			//     "Immutable.List"
			//   ],
			//   "properties": true
			// }
		],
		'no-case-declarations': [
			'error',
		],
		'no-confusing-arrow': [
			'error',
			{
				allowParens: true,
				onlyOneSimpleParam: false,
			},
		],
		'no-else-return': [
			'error',
			{
				allowElseIf: false,
			},
		],
		'no-eval': [
			'error',
		],
		'no-extend-native': [
			'error',
		],
		'no-extra-bind': [
			'error',
		],
		'no-new-func': [
			'error',
		],
		'no-unused-expressions': [
			'error',
			{
				allowTernary: true,
			},
		],
		'no-useless-catch': [
			'error',
		],
		'no-useless-concat': [
			'error',
		],
		'no-useless-escape': [
			'error',
		],
		'no-shadow': [
			'off',
		],
		'@typescript-eslint/no-shadow': [
			'error',
		],
		'no-throw-literal': [
			'error',
		],
		'no-unneeded-ternary': [
			'error',
			{
				defaultAssignment: false,
			},
		],
		'no-object-constructor': [
			'error',
		],
		'no-nested-ternary': [
			'error',
		],
		'no-negated-condition': [
			'error',
		],
		'no-useless-computed-key': [
			'error',
		],
		'no-multi-assign': [
			'error',
			{
				ignoreNonDeclaration: true,
			},
		],
		'no-useless-rename': [
			'error',
			{
				ignoreDestructuring: false,
				ignoreImport: false,
				ignoreExport: false,
			},
		],
		'no-console': [
			'off', // TODO: activate with #2
		],
		'no-promise-executor-return': [
			'error',
		],
		'no-var': [
			'error',
		],
		'object-shorthand': [
			'error',
			'always',
			// {
			//   "ignoreConstructors": false,
			//   "avoidQuotes": true
			// }
		],
		'prefer-const': [
			'error',
			{
				destructuring: 'all',
				ignoreReadBeforeAssign: true,
			},
		],
		'prefer-numeric-literals': [
			'error',
		],
		'prefer-promise-reject-errors': [
			'error',
			{
				allowEmptyReject: true,
			},
		],
		radix: [
			'error',
		],
		'unicode-bom': [
			'error',
			'never',
		],
		'use-isnan': [
			'error',
		],
		'no-async-promise-executor': [
			// throw inside async executor isn't propaganated.
			// Feel free to use it if you do it correctly!
			'error',
		],
		'no-template-curly-in-string': [
			'error',
		],
		'no-sparse-arrays': [
			'error',
		],
		'require-atomic-updates': [
			'error',
		],
		'no-unsafe-negation': [
			'error',
		],
		'no-unsafe-optional-chaining': [
			'error',
			{
				disallowArithmeticOperators: true,
			},
		],
		'no-cond-assign': [
			'error',
			'always',
		],
		'no-unsafe-finally': [
			'error',
		],
	},
}

// eslint-disable-next-line import/no-default-export
export default defineConfig([
	{
		// acts as global ignores, due to the absence of other properties
		ignores: [
			'.cache',
			'data',
			'**/node_modules',
			'tymia-frontend',
			'tymia-chat-frontend',
			'video-chat-api',
			'tasks',
			'**/build',
			'**/dist',
			'**/coverage',
			'*.d.ts',
			'*.map',
		],
	},
	{
		files: [
			'**/*.ts',
			'**/*.tsx',
			'**/*.mts',
			'**/*.cts',
		],
		...config,
		rules: {
			...config.rules,
			'@typescript-eslint/explicit-module-boundary-types': [
				'error',
			],
		},
	},
	{
		files: [
			'**/*.js',
			'**/*.jsx',
			'**/*.mjs',
			'**/*.cjs',
		],
		...config,
	},
])
