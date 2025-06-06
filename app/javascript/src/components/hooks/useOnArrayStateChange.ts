import { useCallback, useState } from 'react'

function defaultOnSetItems<T>(changed: T[]) {
	return changed
}

export type OnItemsChange<T> = (changed: T | T[] | ((items: T[]) => T[])) => void
type ReturnType<T> = [T[], OnItemsChange<T>]

function useOnArrayStateChange<T extends { id: number }>(
	initialItems: T[] | (() => T[]),
	options?: { onSetItems?: (items: T[]) => T[], parseItem?: (item: T) => T },
): ReturnType<T> {
	const [items, setItems] = useState<T[]>(initialItems)
	const { onSetItems = defaultOnSetItems, parseItem = null } = options ?? {}

	const onItemsChange = useCallback<OnItemsChange<T>>(
		(changed: T | T[] | ((items: T[]) => T[])) => {
			if (!changed) {
				setItems([])
				return
			}

			if (Array.isArray(changed)) {
				setItems(onSetItems(parseItem ? changed.map(parseItem) : changed))
				return
			}

			if (typeof changed === 'function') {
				setItems((current) => {
					const changedItems = changed(current)

					return onSetItems(parseItem ? changedItems.map(parseItem) : changedItems)
				})

				return
			}

			setItems((current) => {
				const changedItems = parseItem ? parseItem(changed) : changed
				const { id } = changedItems

				return onSetItems(current.map((c) => (c.id === id ? changedItems : c)))
			})
		},
		[onSetItems, parseItem],
	)

	return [items, onItemsChange]
}

export default useOnArrayStateChange
