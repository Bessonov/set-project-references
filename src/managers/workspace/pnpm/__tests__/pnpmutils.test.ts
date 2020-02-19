import fs from 'fs'
import { getPnpmWorkspaceConfig } from '../PnpmUtils'

function createSystemError(fn: () => void): Error {
	try {
		fn()
		throw new Error(`error wasn't thrown for ${fn}`)
	} catch (e) {
		return e
	}
}

const fsReal: typeof fs = jest.requireActual('fs')

const mockReadFileSync: jest.Mock<ReturnType<typeof fsReal['readFileSync']>> = jest.fn()
jest.mock('fs', () => ({
	...fsReal,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readFileSync: (...args: any[]) => mockReadFileSync(...args),
}))

describe('test getPnpmWorkspaceConfig', () => {
	it('get configuration', () => {
		// myworkspace/pnpm-workspace.yaml
		mockReadFileSync.mockReturnValueOnce(fsReal.readFileSync(`${__dirname}/pnpm-workspace-01.yaml`))

		const config = getPnpmWorkspaceConfig('myworkspace')

		expect(config).toMatchObject({
			packages: ['packages/*'],
		})

		expect(mockReadFileSync).toBeCalledWith('myworkspace/pnpm-workspace.yaml', 'utf8')
		expect(mockReadFileSync).toBeCalledTimes(1)
	})

	it(`workspace can't be a directory`, () => {
		mockReadFileSync.mockImplementationOnce(() => {
			throw createSystemError(() => fsReal.readFileSync(__dirname))
		})

		expect(() => getPnpmWorkspaceConfig('myworkspace'))
			.toThrowError(`EISDIR: illegal operation on a directory, read`)
	})

	it('no workspace if no file found', () => {
		mockReadFileSync.mockImplementationOnce(() => {
			throw createSystemError(() => fsReal.readFileSync('/fake/workspace.yml'))
		})
		expect(getPnpmWorkspaceConfig('myworkspace')).toBeNull()
	})
})
