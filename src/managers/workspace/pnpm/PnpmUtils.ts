import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

import { PnpmWorkspaceConfig } from './PnpmWorkspaceConfig'
import { nullOnNotfound } from '../../../common/FileUtils'
import { Module } from '../../module/Module'

export function getPnpmWorkspaceConfig(workspacePath: string): PnpmWorkspaceConfig | null {
	return nullOnNotfound<PnpmWorkspaceConfig>(() => {
		const workspaceFile = `${workspacePath}/pnpm-workspace.yaml`
		// I'm very confident that the configuration has the right format,
		// because otherwise pnpm will not work
		return yaml.load(fs.readFileSync(workspaceFile, 'utf8')) as PnpmWorkspaceConfig
	})
}

/**
 * Determine if dependency is linked.
 * It helps to find out if the dependency comes
 * from the workspace or from external source
 */
export function isWorkspaceDependency(module: Module, dependency: Module): boolean {
	return !!nullOnNotfound(() => {
		// pnpm is very strict and therefore it
		// should be eniugh to look at node_modules
		const dependencyPath = fs.realpathSync(path.resolve(
			module.path,
			'node_modules',
			dependency.packageJson.content.name,
		))
		const ownModulePath = fs.realpathSync(dependency.path)
		return dependencyPath === ownModulePath
	})
}
