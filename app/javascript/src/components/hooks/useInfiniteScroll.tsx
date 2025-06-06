import { RefObject, useEffect, useRef, useCallback } from 'react'

import useSeeMore, { UseSeeMoreParams, UseSeeMoreReturn } from 'src/components/hooks/useSeeMore'

export function observeIntersection(
	element: Element,
	onIntersectionChange: (entry: IntersectionObserverEntry) => void,
	options?: IntersectionObserverInit,
) {
	const observer = new IntersectionObserver((entries) => onIntersectionChange(entries[0]), options)

	observer.observe(element)

	return observer
}

export type UseInfiniteScrollReturn<R> = Omit<UseSeeMoreReturn<R>, 'handleFetchResources'> & {
	endTargetElementRef: RefObject<HTMLDivElement | null>
	getEndTargetElementRef: (
		index: number, totalCount: number, options?: { reverse?: boolean }
	) => RefObject<HTMLDivElement | null> | null
}

export type UseInfiniteScrollParams<T, R> = UseSeeMoreParams<T, R> & {
	id?: number
	onResourcesFetched?: (result: R | null | undefined, endTargetElement: HTMLDivElement) => void
	threshold?: number
}

function useInfiniteScroll<T, R>({
	id,
	onResourcesFetched,
	resourcesCount,
	threshold = 0.2,
	...params
}: UseInfiniteScrollParams<T, R>): UseInfiniteScrollReturn<R> {
	const endTargetElementRef = useRef<HTMLDivElement>(null)

	const { handleFetchResources, isLoading, ...returnRest } = useSeeMore({
		...params, resourcesCount,
	})

	const getEndTargetElementRef = useCallback(
		(index: number, totalCount: number, options?: { reverse?: boolean }) => {
			if (resourcesCount >= totalCount) {
				return null
			}

			if (options?.reverse) {
				return index === 0 ? endTargetElementRef : null
			}

			return index === resourcesCount - 1 ? endTargetElementRef : null
		},
		[resourcesCount],
	)

	// Load the next resources when the end is displayed.
	useEffect(() => {
		const element = endTargetElementRef.current

		if (!element || isLoading) {
			return undefined
		}

		const observer = observeIntersection(
			element,
			async (entry) => {
				if (entry.isIntersecting) {
					await handleFetchResources({
						id,
						onFetched: (result) => onResourcesFetched?.(result, element),
					})
				}
			},
			{ threshold },
		)

		return () => observer.disconnect()
	}, [isLoading, handleFetchResources, threshold, onResourcesFetched, id])

	return { endTargetElementRef, getEndTargetElementRef, isLoading, ...returnRest }
}

export default useInfiniteScroll
