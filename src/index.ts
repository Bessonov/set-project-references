#!/usr/bin/env node

import fs from 'fs'
import program from 'commander'
import path from 'path'
import {
	difference, isEqual, merge,
} from 'lodash'
import { version } from './package.json'
import {
	Module, flattenModules, groupByName, moduleFactory,
} from './managers/module/Module'
import {
	Workspace, flattenWorkspaces, workspaceFactory,
} from './managers/Workspace'
import {
	getTsConfigJson, saveTsConfigJson,
} from './managers/module/TsConfigJson'
import { log } from './common/logging'
import { SetProjectReferencesOptions } from './common/SetProjectReferencesOptions'
import { nullOnNotfound } from './common/FileUtils'

interface ModulesFoundHookProps {
	groupedModules: {
		[name: string]: Module
	}
	options: SetProjectReferencesOptions
}

interface ConfigurationHooks {
	searchWorkspaces?: (root: string) => string[]
	modulesFound?: (props: ModulesFoundHookProps) => ModulesFoundHookProps
	finish?: (props: FinishHookProps) => void
}

interface SetProjectReferencesConfg {
	hooks: Required<ConfigurationHooks>
}

function searchWorkspacesHook(root: string): string[] {
	return [root]
}

function modulesFoundHook(
	{ groupedModules }: ModulesFoundHookProps,
): Pick<ModulesFoundHookProps, 'groupedModules'> {
	return {
		groupedModules,
	}
}
interface FinishHookProps {
	groupedModules: {
		[name: string]: Module
	}
	saveTsConfigJson: typeof saveTsConfigJson
	options: SetProjectReferencesOptions
}

function finishHook(): void {
	// do nothing is the default
}

function getConfiguration(options: SetProjectReferencesOptions): SetProjectReferencesConfg {
	const configFile = path.resolve(options.root, 'set-project-references.js')
	const hooks: ConfigurationHooks | undefined = fs.existsSync(configFile)
		// eslint-disable-next-line import/no-dynamic-require, global-require
		? require(configFile)?.hooks
		: undefined

	return merge(
		{
			hooks: {
				searchWorkspaces: searchWorkspacesHook,
				modulesFound: modulesFoundHook,
				finish: finishHook,
			},
		},
		{
			hooks,
		},
	)
}

function setProjectReferences(options: SetProjectReferencesOptions): void {
	const configuration = getConfiguration(options)

	const workspaces = configuration.hooks.searchWorkspaces(options.root)
		.map(workspacePath => workspaceFactory(workspacePath, null))
		.filter((workspace): workspace is Workspace => !!workspace)

	const flatWorkspaces = flattenWorkspaces(workspaces)

	// contain all modules in all workspaces
	const flatModulesFound = flattenModules(
		flatWorkspaces
			.flatMap(workspace => {
				return workspace.manager.getModulePaths()
					.flatMap(modulePaths => moduleFactory(
						path.resolve(workspace.manager.path, modulePaths),
						workspace,
					))
			}),
	)

	// allows a quick access by module name
	const groupedModulesFound = groupByName(flatModulesFound)

	const { groupedModules } = configuration.hooks.modulesFound({
		groupedModules: groupedModulesFound,
		options,
	})

	// just for success banner at the end
	let everythingIsFine = true

	for (const module of Object.values(groupedModules)) {
		const linkedModules = []
		for (const [depName] of Object.entries({
			...module.packageJson.content.dependencies ?? {},
			...module.packageJson.content.devDependencies ?? {},
		})) {
			const ownDepModule = groupedModules[depName]
			// is this module known by our workspace?
			if (ownDepModule) {
				// is this module dependency managed by workspace manager?
				if (module.workspace?.manager.isWorkspaceDependency(module, ownDepModule)) {
					linkedModules.push(ownDepModule)
				}
			}
		}

		const tsConfig = nullOnNotfound(() => getTsConfigJson(module.path))
		// do not try to edit file, if the file doesn't exists
		if (!tsConfig) {
			// eslint-disable-next-line no-continue
			continue
		}
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const currentReferences = tsConfig.content.references?.map(reference => reference.path) ?? []
		const desiredReferences = linkedModules.map(
			linkedModule => path.relative(module.path, linkedModule.path),
		)

		if (isEqual(currentReferences, desiredReferences) === false) {
			everythingIsFine = false
			const missingReferences = difference(desiredReferences, currentReferences)
			const obsoleteReferences = difference(currentReferences, desiredReferences)

			if (missingReferences.length > 0) {
				log(`Module ${module.packageJson.content.name} is missing references: ${
					JSON.stringify(missingReferences)}`)
			}

			if (obsoleteReferences.length > 0) {
				log(`Module ${module.packageJson.content.name} has obsolete references: ${
					JSON.stringify(obsoleteReferences)}`)
			}

			if (options.save) {
				tsConfig.content.references = desiredReferences.sort().map(ref => ({ path: ref }))
				saveTsConfigJson(tsConfig, { indentation: options.indentationTsConfig })
			}
		}
	}

	if (everythingIsFine) {
		log('Everything is fine.')
	}

	configuration.hooks.finish({
		groupedModules,
		saveTsConfigJson,
		options,
	})
}

program.version(version)

program
	.option('-r, --root <path>', 'path to the root of monorepo', process.cwd())
	.option('-s, --save', 'write changes to the files', false)
	.option('-t, --indentation-ts-config <chars>', `indentation of tsconfig.json. Use $'\\t' for a tab`)
	.action(setProjectReferences)

program.parse(process.argv)
