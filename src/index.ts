#!/usr/bin/env node

import program from 'commander'
import path from 'path'
import fs from 'fs'
import {
	difference, isEqual,
} from 'lodash'
import { version } from './package.json'
import { Module } from './common/Module'
import {
	error, log,
} from './common/logging'
import { SetProjectReferencesOptions } from './common/SetProjectReferencesOptions'
import './yarn/YarnWorkspaceManager'
import { getWorkspaceManager } from './common/WorkspaceManager'
import { TsConfigJson } from './common/TsConfigJson'
import {
	guessJsonIndentation, readJson,
} from './common/utils'

type ModulesMap = { [key: string]: Module }

function getReferences(module: Module, modulesMap: ModulesMap): string[] {
	const result: string[] = []
	const { dependencies } = module.packageJson

	for (const [dependency, dependencyVersion] of Object.entries(dependencies || [])) {
		// it's own module?
		if (dependency in modulesMap) {
			const dependencyModule = modulesMap[dependency]
			const dependencyModuleVersion = dependencyModule.packageJson.version

			// compare versions to ensure linking to right module
			if (dependencyModule.packageJson.version !== dependencyVersion) {
				error(`Version ${dependency}@${dependencyVersion} doesn't match `
					+ `${dependencyModuleVersion} in module ${module.packageJson.name}`)
				continue // eslint-disable-line no-continue
			}
			const referencePath = path.relative(module.path, dependencyModule.path)
			log(`Module ${module.packageJson.name} has a reference `
				+ `to ${dependencyModule.packageJson.name} (${referencePath})`)
			result.push(referencePath)
		}
	}

	return result.sort()
}

async function setProjectReferences(options: SetProjectReferencesOptions): Promise<void> {
	const workspaceManager = getWorkspaceManager(options)

	const modules = await workspaceManager.getModules()

	const modulesMap = modules.reduce<ModulesMap>(
		// eslint-disable-next-line no-param-reassign
		(stash, module) => { stash[module.getName()] = module; return stash },
		{},
	)

	for (const modul of modules) {
		const desiredReferences = getReferences(modul, modulesMap)
		const currentReferences = (modul.tsConfigJson.references || []).map((ref) => ref.path)
		if (isEqual(desiredReferences, currentReferences) === false) {
			log(`Current refrences ${JSON.stringify(currentReferences)} are `
				+ `not equal to ${JSON.stringify(desiredReferences)}`)

			if (options.save) {
				const newReferences = desiredReferences.map((ref) => ({ path: ref }))
				if (newReferences.length > 0) {
					modul.tsConfigJson.references = newReferences
				} else {
					delete modul.tsConfigJson.references
				}

				modul.saveTsConfigJson({ indentation: options.indentationTsConfig })
			}
		}
	}

	const monorepoTsConfigFile = options.monorepoTsConfig
	if (monorepoTsConfigFile) {
		let monorepoTsConfig: TsConfigJson = { files: [] }
		let indentation = '\t'
		if (fs.existsSync(monorepoTsConfigFile)) {
			monorepoTsConfig = JSON.parse(readJson(monorepoTsConfigFile))
			indentation = guessJsonIndentation(
				monorepoTsConfigFile,
				options.indentationTsConfig ?? indentation,
			)
		} else {
			error(`typescript main config file ${monorepoTsConfigFile} doesn't exists`)
		}

		const currentReferences = (monorepoTsConfig.references || []).map((ref) => ref.path)
		const desiredReferences = Object.values(modulesMap)
			.map((module) => path.relative(path.dirname(monorepoTsConfigFile), module.path))

		const missingReferences = difference(desiredReferences, currentReferences)
		const obsoleteReferences = difference(currentReferences, desiredReferences)

		if (missingReferences.length > 0) {
			log(`Missing main references: ${JSON.stringify(missingReferences)}`)
		}

		if (obsoleteReferences.length > 0) {
			log(`Obsolete main references: ${JSON.stringify(obsoleteReferences)}`)
		}

		if (options.save) {
			monorepoTsConfig.references = desiredReferences.sort().map((ref) => ({ path: ref }))
			const content = JSON.stringify(monorepoTsConfig, null, indentation)
			fs.writeFileSync(monorepoTsConfigFile, content)
		}
	}
}

program.version(version)

program
	.option('-r, --root <path>', 'path to the root of monorepo', process.cwd())
	.option('-m, --monorepo-ts-config <path>', 'path to the typescript main configuration file')
	.option('-s, --save', 'write changes to the files', false)
	.option('-t, --indentation-ts-config <chars>', `indentation of tsconfig.json. Use $'\\t' for a tab`)
	.action(setProjectReferences)

program.parse(process.argv)
