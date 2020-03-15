import {
	WorkspaceManager, getWorkspaceManager,
} from './WorkspaceManager'


export class Workspace {
	children: Workspace[] = []
	constructor(
		public readonly path: string,
		public readonly manager: WorkspaceManager,
		public readonly parent: Workspace | null,
	) {
	}
}

export function workspaceFactory(path: string, parent: Workspace | null): Workspace | null {
	const manager = getWorkspaceManager(path)
	if (manager === null) {
		return null
	}
	const workspace = new Workspace(path, manager, parent)
	workspace.children = manager.getModulePaths()
		// avoid recursive calls
		// eslint-disable-next-line @typescript-eslint/no-extra-parens
		.map(modulePath => (modulePath === path ? null : workspaceFactory(modulePath, workspace)))
		.filter((moduleWorkspaces): moduleWorkspaces is Workspace => !!moduleWorkspaces)
	return workspace
}

export function flattenWorkspaces(workspaces: Workspace[]): Workspace[] {
	return workspaces.flatMap(workspace => [workspace, ...flattenWorkspaces(workspace.children)])
}
