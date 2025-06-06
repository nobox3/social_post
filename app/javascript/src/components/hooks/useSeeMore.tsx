import { useCallback } from 'react'

import useAbortController from 'src/components/hooks/useAbortController'

type ApiServiceParams = { outset: number } & object
type ApiService<R> = (params: ApiServiceParams, signal: AbortSignal) => Promise<R>
type ApiServiceWithId<R> = (id: number, params: ApiServiceParams, signal: AbortSignal) => Promise<R>

type HandleFetchResourcesOptions<R> = {
	id?: number
	onFetched?: (result: R | null | undefined) => void
	params?: object
}

export type UseSeeMoreReturn<R> = {
	handleFetchResources: (options?: HandleFetchResourcesOptions<R>) => Promise<void>
	isLoading: boolean
	triggerAbort: () => void
}

export type UseSeeMoreParams<T, R> = {
	apiService?: ApiService<R>
	apiServiceWithId?: ApiServiceWithId<R>
	onAddResources: (result: R) => { prepend?: boolean, resources: T[] }
	resourcesCount: number
	setResources: (changed: ((current: T[]) => T[])) => void
}

function useSeeMore<T, R>({
	apiService,
	apiServiceWithId,
	onAddResources,
	resourcesCount,
	setResources,
}: UseSeeMoreParams<T, R>): UseSeeMoreReturn<R> {
	const { handleWithAbortSignal, isLoading, triggerAbort } = useAbortController()

	const fetchResources = useCallback(
		async (params?: object, id?: number) => {
			const apiParams = { outset: resourcesCount, ...params }

			return handleWithAbortSignal<R>((signal) => {
				if (id && apiServiceWithId) {
					return apiServiceWithId(id, apiParams, signal)
				}

				if (apiService) {
					return apiService(apiParams, signal)
				}

				return null
			})
		},
		[resourcesCount, handleWithAbortSignal, apiServiceWithId, apiService],
	)

	const handleFetchResources = useCallback(
		async (options?: HandleFetchResourcesOptions<R>) => {
			const { id, onFetched, params } = options ?? {}
			const result = await fetchResources(params, id)

			onFetched?.(result)

			if (result) {
				const { prepend = false, resources } = onAddResources(result)

				setResources((current: T[]) => {
					return prepend ? resources.concat(current) : current.concat(resources)
				})
			}
		}, [fetchResources, onAddResources, setResources],
	)

	return { handleFetchResources, isLoading, triggerAbort }
}

export default useSeeMore
