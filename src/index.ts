#!/usr/bin/env node

import program from 'commander'
import glob from 'glob'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { isEqual } from 'lodash'
import { version } from './package.json'
import { Module } from './Module'
import {
	error, log,
} from './logging'
import { PackageJson } from './PackageJson'

type ModulesMap = { [key: string]: Module }

interface SetProjectReferencesOptions {
	root: string | undefined
	save: true | undefined
	indentationTsConfig: string | undefined
}

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
	const root = options.root || process.cwd()
	const rootPackageJsonFile = `${root}/package.json`
	log(`Looking for project root in ${rootPackageJsonFile}`)

	const packageJson: PackageJson = JSON.parse(
		fs.readFileSync(rootPackageJsonFile, { encoding: 'utf8' }),
	)
	const pattern = `${root}/${packageJson.workspaces}/package.json`
	log(`Looking for modules in ${pattern}`)

	const files = await promisify(glob)(pattern)

	const modules = files.map((file) => {
		const modulePath = file.replace('/package.json', '')
		return new Module(modulePath)
	})

	const modulesMap = modules.reduce<ModulesMap>(
		// eslint-disable-next-line no-param-reassign
		(stash, module) => { stash[module.packageJson.name] = module; return stash },
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
}

program.version(version)

program
	.option('-r, --root <path>', 'path to the root of monorepo')
	.option('-s, --save', 'write changes to the files')
	.option('-t, --indentation-ts-config <chars>', `indentation of tsconfig.json. Use $'\\t' for a tab`)
	.action(setProjectReferences)

program.parse(process.argv)
