function isErrnoException(e: unknown): e is NodeJS.ErrnoException {
	return e !== null
		&& typeof e === 'object'
		&& 'code' in e
		&& typeof (e as { code: string }).code === 'string'
}

export function nullOnNotfound<T>(fn: () => T): T | null {
	try {
		return fn()
	} catch (e) {
		// workspace not found, it's OK, return null
		if (isErrnoException(e) && e.code === 'ENOENT') {
			return null
		}
		throw e
	}
}
