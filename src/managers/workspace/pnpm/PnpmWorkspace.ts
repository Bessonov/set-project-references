import glob from 'glob'
import fs from 'fs'
import path from 'path'
import {
	getPnpmWorkspaceConfig,
	isWorkspaceDependency as isWorkspaceDependencyUtil,
} from './PnpmUtils'
import { PnpmWorkspaceConfig } from './PnpmWorkspaceConfig'
import { Module } from '../../module/Module'
import { WorkspaceManager } from '../../WorkspaceManager'

export class PnpmWorkspaceManager implements WorkspaceManager {
	// eslint-disable-next-line no-shadow
	constructor(readonly path: string, private config: PnpmWorkspaceConfig) {
	}

	getModulePaths(): string[] {
		return this.config.packages
			// avoid recursion with '.' glob
			// eslint-disable-next-line @typescript-eslint/no-extra-parens
			.flatMap(pattern => (pattern === '.' ? [path.resolve(this.path)] : glob.sync(pattern, { cwd: this.path })))
			.filter(pathFromPattern => fs.existsSync(`${path.resolve(this.path, pathFromPattern)}/package.json`))
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
