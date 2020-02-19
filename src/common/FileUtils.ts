export function nullOnNotfound<T>(fn: () => T): T | null {
	try {
		return fn()
	} catch (e) {
		// workspace not found, it's OK, but returns null
		if (e.code === 'ENOENT') {
			return null
		}
		throw e
	}
}

export function undefinedToNull<T>(obj: T | undefined): T | null {
	return obj ?? null
}
