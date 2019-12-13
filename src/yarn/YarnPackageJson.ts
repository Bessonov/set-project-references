import { PackageJson } from '../common/PackageJson'

export interface YarnPackageJson extends PackageJson {
	workspaces: string[]
}

export function isYarnPackageJson(packageJson: PackageJson): packageJson is YarnPackageJson {
	return 'workspaces' in packageJson
}
