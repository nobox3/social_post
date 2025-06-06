const REGEXP = {
	IsTouchDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
} as const

export function isTouchDevice() {
	return REGEXP.IsTouchDevice.test(window.navigator.userAgent)
}

export function isMacOs() {
	return window.navigator.userAgent.includes('Mac OS')
}

export function sumObjValues(counts: Record<string, number>) {
	return Object.values(counts || {}).reduce((acc, count) => acc + count, 0)
}

export function areModifierKeysPressed(e: KeyboardEvent, ...keys: string[]) {
	return keys.length !== 0 && keys.every((key) => e.getModifierState(key))
}

export function intervalValues<T>(
	params: { count: number, interval: number, offset?: number },
	callback: (value: number, i: number) => T,
) {
	const { count, interval, offset = 0 } = params

	return Array(count)
		.fill(interval)
		.map((base: number, i: number) => callback(base * (i + offset), i))
}

export function insertStr(currentStr: string, strToInsert: string, position: number) {
	const beforeValue = currentStr.slice(0, position)
	const afterValue = currentStr.slice(position)

	return beforeValue + strToInsert + afterValue
}

export function indexBy<K extends keyof T, V extends string, T extends Record<K, V>>(
	propertyName: K, objs: T[],
): Partial<Record<V, T>> {
	const result: Partial<Record<V, T>> = {}

	return (
		objs?.reduce((acc, obj) => {
			acc[obj[propertyName]] = obj

			return acc
		}, result) || result
	)
}
