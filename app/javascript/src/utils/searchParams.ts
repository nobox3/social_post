export function toURLSearchParams(params: object | undefined) {
	return Object.entries(params ?? {}).reduce((searchParams, [key, value]) => {
		if (value === null || value === undefined || value === '') {
			return searchParams
		}

		if (Array.isArray(value)) {
			value.forEach((v) => searchParams.append(`${key}[]`, String(v)))
		} else {
			searchParams.append(key, String(value))
		}

		return searchParams
	}, new URLSearchParams())
}

export function toStrSearchParams(params: object | URLSearchParams | undefined) {
	const searchParams = params instanceof URLSearchParams ? params : toURLSearchParams(params)

	return searchParams.size > 0 ? `?${searchParams.toString()}` : ''
}

export function fromURLSearchParams(targetKeys: readonly string[]) {
	const searchParams = new URLSearchParams(window.location.search)

	return targetKeys.reduce<Record<string, unknown>>((params, key) => {
		const value = searchParams.get(key)

		value && (params[key] = value)

		return params
	}, {})
}

export function updateSearchParamsObject(
	params: object | undefined, currentParams: object, options?: { isReplace?: boolean },
) {
	const { isReplace } = options ?? {}

	if (!params) {
		return isReplace ? {} : currentParams
	}

	const updatedParams = isReplace ? { ...params } : { ...currentParams, ...params }

	return Object.entries(params).reduce<Record<string, unknown>>((merged, [key, value]) => {
		if (value === null || value === undefined || value === '') {
			delete merged[key]
		}

		return merged
	}, updatedParams)
}
