export interface PackageJson {
	readonly name: string
	readonly version: string
	readonly dependencies?: {
		// module name: version
		readonly [key: string]: string
	}
}
