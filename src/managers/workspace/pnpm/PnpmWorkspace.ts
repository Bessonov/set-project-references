import fs from 'fs'
import {
	globSync,
} from 'glob'
import {
	resolve,
} from 'path'
import {
	Module,
} from '../../module/Module.js'
import {
	WorkspaceManager,
} from '../../WorkspaceManager.js'
import {
	getPnpmWorkspaceConfig,
	isWorkspaceDependency as isWorkspaceDependencyUtil,
} from './PnpmUtils.js'
import {
	PnpmWorkspaceConfig,
} from './PnpmWorkspaceConfig.js'

export class PnpmWorkspaceManager implements WorkspaceManager {
	constructor(readonly path: string, private config: PnpmWorkspaceConfig) {
	}

	getModulePaths(): string[] {
		return this.config.packages
			// avoid recursion with '.' glob
			.flatMap(pattern => (pattern === '.' ? [resolve(this.path)] : globSync(pattern, { cwd: this.path })))
			.filter(pathFromPattern => fs.existsSync(`${resolve(this.path, pathFromPattern)}/package.json`))
	}

	isWorkspaceDependency = (module: Module, dependency: Module): boolean => {
		return isWorkspaceDependencyUtil(module, dependency)
	}
}

export function pnpmWorkspaceManagerFactory(workspacePath: string): PnpmWorkspaceManager | null {
	const config = getPnpmWorkspaceConfig(workspacePath)
	if (config === null) {
		return null
	}
	// pnpm adds current module by default
	if (config.packages.indexOf('.') === -1) {
		config.packages.unshift('.')
	}
	return new PnpmWorkspaceManager(workspacePath, config)
}
