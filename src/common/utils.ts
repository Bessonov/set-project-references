import fs from 'fs'
import detectIndent from 'detect-indent'
import JSON from 'comment-json'
import { nullOnNotfound } from './FileUtils'

export function fileExists(filePath: string): boolean {
	return fs.existsSync(filePath)
}

export function readJson<T>(filePath: string): T {
	return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))
}

export function saveJson<T>(filePath: string, content: T, indentation: string): void {
	const contentAsString = JSON.stringify(content, null, indentation)
	fs.writeFileSync(filePath, contentAsString)
}

export function guessJsonIndentation(filePath: string, indentation?: string): string {
	const guessedIndent = nullOnNotfound(() => {
		const { indent } = detectIndent(fs.readFileSync(filePath, { encoding: 'utf8' }))
		return indent
	})
	const finalIndentation = guessedIndent ?? indentation
	if (finalIndentation === undefined) {
		throw new Error(`Indentation for the file ${filePath} is neither provided nor can be guessed`)
	}
	return finalIndentation
}
