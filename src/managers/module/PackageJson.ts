import { nullOnNotfound } from '../../common/FileUtils'
import { readJson } from '../../common/utils'

interface PackageJsonMeta {
	readonly path: string
}

type Version = string

interface PackageJsonContent {
	readonly name: string
	readonly version: string
	readonly dependencies?: {
		// module name: version
		readonly [moduleName: string]: Version
	}
}

export interface PackageJson {
	meta: PackageJsonMeta
	content: PackageJsonContent
}

export function getPackageJson(path: string): PackageJson | null {
	return nullOnNotfound<PackageJson>(() => {
		const content: PackageJsonContent = readJson(`${path}/package.json`)
		// TODO: validation of config file
		return {
			meta: {
				path,
			},
			content,
		}
	})
}
