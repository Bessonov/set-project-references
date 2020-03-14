import { pnpmWorkspaceManagerFactory } from './workspace/pnpm/PnpmWorkspace'
import { Module } from './module/Module'

export interface WorkspaceManager {
	readonly path: string

	/**
	 * returns relative paths for modules
	 */
	getModulePaths(): string[]

	/**
	 * check if dependency is linked to module
	 */
	isWorkspaceDependency(module: Module, dependency: Module): boolean
}

export function getWorkspaceManager(path: string): WorkspaceManager | null {
	// currently, only pnpm is supported
	return pnpmWorkspaceManagerFactory(path)
}
