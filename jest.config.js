const { defaults } = require('jest-config')

module.exports = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	globals: {
		'ts-jest': {
			// https://github.com/kulshekhar/ts-jest/issues/805
			isolatedModules: true,
		},
	},
	testRegex: '/__tests__/.*\\.(test|spec)\\.ts$',
	moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
	coverageThreshold: {
		global: {
			// statements: 100,
			// branches: 100,
			// functions: 100,
			// lines: 100,
		},
	},
}
