import glob from 'glob'
import fs from 'fs'
import { promisify } from 'util'
import {
	WorkspaceManager, registerWorkspaceManagerFactory,
} from '../common/WorkspaceManager'
import { SetProjectReferencesOptions } from '../common/SetProjectReferencesOptions'
import { readJson } from '../common/utils'
import {
	YarnPackageJson, isYarnPackageJson,
} from './YarnPackageJson'
import { Module } from '../common/Module'

function readPackageJson(basePath: string): YarnPackageJson {
	return JSON.parse(readJson(`${basePath}/package.json`))
}

class YarnWorkspaceManager implements WorkspaceManager {
	constructor(private options: SetProjectReferencesOptions) {
	}

	name = 'yarn'

	readonly match = (): boolean => {
		return isYarnPackageJson(this.getRootPackageJson())
	}

	readonly getModules = async (): Promise<Module[]> => {
		const rootPackageJson: YarnPackageJson = this.getRootPackageJson()
		const modules: Module[] = []
		for (const pattern of rootPackageJson.workspaces) {
			// eslint-disable-next-line no-await-in-loop
			const files = await promisify(glob)(`${this.options.root}/${pattern}`)
			files
				.filter((file) => fs.statSync(file).isDirectory())
				.forEach((moduleRoot) => {
					modules.push(new Module(moduleRoot))
				})
		}
		return modules
	}

	private readonly getRootPackageJson = (): YarnPackageJson => {
		return readPackageJson(this.options.root)
	}
}

registerWorkspaceManagerFactory((options) => new YarnWorkspaceManager(options))
