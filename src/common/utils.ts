import fs from 'fs'
import detectIndent from 'detect-indent'

export function readJson(path: string): string {
	return fs.readFileSync(path, { encoding: 'utf8' })
}

export function guessJsonIndentation(path: string, indentation?: string): string {
	const { indent } = detectIndent(readJson(path))
	if (indent === undefined && indentation === undefined) {
		throw new Error(`Indentation for the file ${path} is neither provided nor can be guessed`)
	}
	return indent
}
