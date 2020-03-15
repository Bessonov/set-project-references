import {
	guessJsonIndentation, readJson, saveJson,
} from '../../common/utils'

interface TsConfigJsonContent {
	files?: []
	references?: TsReference[]
}

interface TsConfigJsonMeta {
	path: string
}

interface TsReference {
	path: string
}

export interface SaveTsConfigJsonOptions {
	filename?: string
	indentation?: string
}

export interface TsConfigJson {
	meta: TsConfigJsonMeta
	content: TsConfigJsonContent
}

export function getTsConfigJson(path: string): TsConfigJson {
	const tsConfigJsonFile = `${path}/tsconfig.json`
	const content: TsConfigJsonContent = readJson(tsConfigJsonFile)
	// TODO: validation of config file
	return {
		meta: {
			path,
		},
		content,
	}
}

export function saveTsConfigJson(
	tsConfigJson: TsConfigJson,
	tsConfigJsonOptions?: SaveTsConfigJsonOptions,
): void {
	const tsConfigJsonFile = `${tsConfigJson.meta.path}/${tsConfigJsonOptions?.filename ?? 'tsconfig.json'}`
	const usedIndentation = guessJsonIndentation(tsConfigJsonFile, tsConfigJsonOptions?.indentation)
	saveJson(tsConfigJsonFile, tsConfigJson.content, usedIndentation)
}
