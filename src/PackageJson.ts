export interface PackageJson {
	name: string
	version: string
	dependencies?: {
		[key: string]: string
	}
	workspaces?: string[]
}
