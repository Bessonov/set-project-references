import fs from 'fs'
import detectIndent from 'detect-indent'
import { PackageJson } from './PackageJson'

interface TsConfigJson {
	references?: {
		path: string
	}[]
}

interface SaveTsConfigJsonOptions {
	indentation?: string
}

function readJson(path: string): string {
	return fs.readFileSync(path, { encoding: 'utf8' })
}

function guessJsonIndentation(path: string, indentation?: string): string {
	const { indent } = detectIndent(readJson(path))
	if (indent === undefined && indentation === undefined) {
		throw new Error(`Indentation for the file ${path} is neither provided nor can be guessed`)
	}
	return indent
}

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

	readonly saveTsConfigJson = (options: SaveTsConfigJsonOptions = {}): void => {
		const indent = guessJsonIndentation(
			this.getTsConfigJsonFile(),
			options.indentation,
		)

		const content = JSON.stringify(
			this.tsConfigJson,
			null,
			indent,
		)

		fs.writeFileSync(this.getTsConfigJsonFile(), content)
	}
}
