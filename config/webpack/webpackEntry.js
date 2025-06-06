const { readdirSync, statSync } = require('fs')
const { join, resolve } = require('path')
const { config } = require('shakapacker')

const sourcePath = resolve('', config.source_path)

module.exports.getEntry = (sourceEntryPath, dir = '') => {
	let entry = {}
	const fullDir = join(sourcePath, sourceEntryPath, dir)

	readdirSync(fullDir).forEach((file) => {
		const fullPath = join(fullDir, file)
		const path = join(dir, file)

		if (statSync(fullPath).isDirectory()) {
			entry = { ...entry, ...this.getEntry(sourceEntryPath, path) }
		} else {
			addEntryPath(entry, path.replace(/\..+$/, ''), fullPath)
		}
	})

	return entry
}

module.exports.addEntry = (sourceEntryPath, currentEntry) => {
	Object.entries(this.getEntry(sourceEntryPath)).forEach(([name, newPath]) => {
		addEntryPath(currentEntry, name, newPath)
	})
}

const addEntryPath = (entry, name, newPath) => {
	const currentPath = entry[name]

	if (currentPath) {
		if (Array.isArray(currentPath)) {
			currentPath.push(newPath)
		} else {
			entry[name] = [currentPath, newPath]
		}
	} else {
		entry[name] = newPath
	}
}
