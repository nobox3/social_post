import { useCallback, useState, useMemo } from 'react'

export type LocalStorageProxy<T extends string | number = string> = {
	push: (value: T) => void
	removeAll: () => void
	set: (values: T[]) => void
	unshift: (value: T) => void
}

type LocalStorageProxyConfig = {
	distinct?: boolean
	numValues?: number
}

function fetchStorageValue<T,>(key: string): T[] | null {
	const values = localStorage.getItem(key)

	return values ? JSON.parse(values) as T[] : null
}

function useLocalStorageProxy<T extends string | number = string>(
	key: string,
	config: LocalStorageProxyConfig = {},
) {
	const { distinct = true, numValues = 10 } = config
	const [valuesState, setValuesState] = useState<T[] | null>(() => fetchStorageValue(key))

	const setValues = useCallback(
		(values: T[]) => {
			const newValues = distinct ? [...new Set(values)] : values

			newValues.splice(numValues)
			localStorage.setItem(key, JSON.stringify(newValues))
			setValuesState(newValues)
		},
		[distinct, key, numValues],
	)

	const addValue = useCallback(
		(value: T, prepend = false) => {
			const values = fetchStorageValue<T>(key) ?? []

			prepend ? values.unshift(value) : values.push(value)
			setValues(values)
		},
		[key, setValues],
	)

	const removeValues = useCallback(() => {
		localStorage.removeItem(key)
		setValuesState(null)
	}, [key])

	const storageProxy = useMemo<LocalStorageProxy<T>>(() => {
		return {
			push: (value: T) => addValue(value),
			removeAll: removeValues,
			set: setValues,
			unshift: (value: T) => addValue(value, true),
		}
	}, [addValue, removeValues, setValues])

	return [valuesState, storageProxy] as const
}

export default useLocalStorageProxy
