module.exports = {
	root: true,
	env: {
		node: true,
		jest: true,
	},
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	rules: {
		'arrow-body-style': 'off',
		'lines-between-class-members': 'off',
		'implicit-arrow-linebreak': 'off',
		'no-console': 'error',
		'no-trailing-spaces': 'error',
		'no-restricted-syntax': 'off',
		'indent': [
			'error',
			'tab',
		],
		'object-curly-newline': [
			'error',
			{
				ImportDeclaration: {
					minProperties: 2,
					multiline: true,
				}
			}
		],
		semi: [
			'error',
			'never',
		],
		quotes: [
			'error',
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true
			}
		],
		'comma-dangle': [
			'error',
			'always-multiline'
		],
		'no-tabs': [
			'error',
			{
				'allowIndentationTabs': true
			}
		],
		'sort-imports': [
			'error',
			{
				ignoreDeclarationSort: true,
			}
		],
		'arrow-parens': [
			'error',
			'as-needed',
		],
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/no-angle-bracket-type-assertion': 'off',
		'@typescript-eslint/no-object-literal-type-assertion': 'off',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-extra-parens': 'error',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'none'
				}
			}
		],
		'@typescript-eslint/indent': [
			'error',
			'tab'
		],
		'import/prefer-default-export': 'off',
		'import/no-default-export': 'error',
		'import/no-unresolved': 'off',
		'import/no-useless-path-segments': 'error',
		'import/no-cycle': 'error',
		// doesn't work for central devDependencies
		'import/no-extraneous-dependencies': 'off',
	},
	overrides: [
		{
			files: ['**/*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off'
			},
		},
		{
			files: ['**/__tests__/**'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off',
			}
		},
		{
			files: ['**/*.ts', '**/*.d.ts'],
			rules: {
				indent: 'off', // ts has own rule: @typescript-eslint/indent
				'no-useless-constructor': 'off',
			},
		},
	]
}
