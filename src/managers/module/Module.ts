import {
	PackageJson, getPackageJson,
} from './PackageJson'
import { Workspace } from '../Workspace'

/*
/my-app
	package.json (my-app)
	/back
		package.json (@my-app/back)
		/microservice1
			package.json (@my-app/microservice1)
		/microservice2
			package.json (@my-app/microservice2)
	/front
		package.json (@my-app/front)
		/mobile
			package.json (@my-app/mobile)
		/web
			package.json (@my-app/web)
*/

export class Module {
	children: Module[] = []
	constructor(
		public readonly path: string,
		public readonly packageJson: PackageJson, // just for caching purpose
		public readonly workspace: Workspace | null,
	) { }
}

export function moduleFactory(path: string, workspace: Workspace | null): Module[] {
	const packageJson = getPackageJson(path)
	const modules = packageJson ? [new Module(path, packageJson, workspace)] : []
	return modules
}

export function flattenModules(modules: Module[]): Module[] {
	return modules.flatMap(module => [module, ...flattenModules(module.children)])
}

export function groupByName(modules: Module[]): { [name: string]: Module } {
	// allows a quick access by module name
	const inverted: { [name: string]: Module } = Object.assign(
		{},
		...modules.map(module => ({ [module.packageJson.content.name]: module })),
	)
	return inverted
}
