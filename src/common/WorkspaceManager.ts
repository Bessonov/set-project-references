import { SetProjectReferencesOptions } from './SetProjectReferencesOptions'
import { Module } from './Module'

export interface WorkspaceManagerFactory {
	(options: SetProjectReferencesOptions): WorkspaceManager
}

export interface WorkspaceManager {
	name: string
	match(): boolean
	getModules(): Promise<Module[]>
}

const workspaceManagerFactories: WorkspaceManagerFactory[] = []

export function registerWorkspaceManagerFactory(
	workspaceManagerFactory: WorkspaceManagerFactory,
): void {
	workspaceManagerFactories.push(workspaceManagerFactory)
}

export function getWorkspaceManager(options: SetProjectReferencesOptions): WorkspaceManager {
	const workspaceManagers = workspaceManagerFactories
		.map((factory) => factory(options))
		.filter((manager) => manager.match())

	if (workspaceManagers.length === 1) {
		return workspaceManagers[0]
	}

	if (workspaceManagers.length > 1) {
		const matchedManagers = workspaceManagers.map((manager) => manager.name).join(', ')
		throw new Error(`multiple managers matched: ${matchedManagers}`)
	}

	throw new Error('no workspace found')
}
