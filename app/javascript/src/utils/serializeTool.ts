type ObjectType = Record<string, unknown>

export function isObject(value: unknown): value is ObjectType {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const underscoreRegExp = /(?=[A-Z][a-z])|(?<=[a-z])[A-Z]/g

export function toUnderscore(str: string) {
	return str
		.replace(underscoreRegExp, (match: string, offset: number) => (offset === 0 ? '' : `_${match}`))
		.toLowerCase()
}

export function toUnderscoreObjectKeys(src: ObjectType) {
	const result: ObjectType = {}

	Object.keys(src).forEach((key) => {
		const value: unknown = src[key]

		if (isObject(value)) {
			result[key] = toUnderscoreObjectKeys(value)
		} else {
			result[toUnderscore(key)] = value
		}
	})

	return result
}
