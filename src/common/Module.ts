import fs from 'fs'
import { PackageJson } from './PackageJson'
import { TsConfigJson } from './TsConfigJson'
import {
	guessJsonIndentation, readJson,
} from './utils'
import { SaveTsConfigJsonOptions } from './SaveTsConfigJsonOptions'

export class Module {
	readonly packageJson: PackageJson
	readonly tsConfigJson: TsConfigJson

	constructor(readonly path: string) {
		this.packageJson = JSON.parse(readJson(this.getPackageJsonFile()))
		this.tsConfigJson = JSON.parse(readJson(this.getTsConfigJsonFile()))
	}

	private readonly getPackageJsonFile = (): string => {
		return `${this.path}/package.json`
	}

	private readonly getTsConfigJsonFile = (): string => {
		return `${this.path}/tsconfig.json`
	}

	readonly getName = (): string => {
		return this.packageJson.name
	}

	readonly saveTsConfigJson = (options: SaveTsConfigJsonOptions = {}): void => {
		const indent = guessJsonIndentation(this.getTsConfigJsonFile(), options.indentation)
		const content = JSON.stringify(this.tsConfigJson, null, indent)
		fs.writeFileSync(this.getTsConfigJsonFile(), content)
	}
}
