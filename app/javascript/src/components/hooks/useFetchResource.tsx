import { useCallback, useState, useContext } from 'react'

import useAbortController from 'src/components/hooks/useAbortController'
import useReloadPageOnPopState from 'src/components/hooks/useReloadPageOnPopState'
import { I18nMetaParams, SiteMetaContext } from 'src/components/providers/SiteMetaProvider'
import ApiSearchParams from 'src/core/types/ApiSearchParams'
import { fromURLSearchParams, updateSearchParamsObject } from 'src/utils/searchParams'

const DEFAULT_AVAILABLE_SEARCH_PARAMS_KEYS = ['s', 'page'] as const

export type ApiService<R> = (params: ApiSearchParams, signal: AbortSignal) => Promise<R>

export type ApiServiceWithId<R, Id = number> = (
	id: Id, params: ApiSearchParams, signal: AbortSignal
) => Promise<R>

type HandleFetchResourceOptions<Id> = {
	id?: Id
	params?: ApiSearchParams
	pathToPush?: string
	replaceParams?: boolean
}

export type HandleFetchResource<T, Id = number> = (
	targetResourceKey: T, options?: HandleFetchResourceOptions<Id>
) => Promise<void>

type UseFetchResourceParams<T extends string, R, Id> = {
	apiServices?: Partial<Record<T, ApiService<R>>>
	apiServicesWithId?: Partial<Record<T, ApiServiceWithId<R, Id>>>
	availableSearchParamsKeys?: readonly string[]
	i18nMetaParams?: I18nMetaParams
	initialResult: R
	resourceKeyToPath?: Record<T, string> | string | ((targetResourceKey: T, id?: Id) => string)
}

function useFetchResource<T extends string, R, Id = number>({
	apiServices,
	apiServicesWithId,
	availableSearchParamsKeys = DEFAULT_AVAILABLE_SEARCH_PARAMS_KEYS,
	i18nMetaParams,
	initialResult,
	resourceKeyToPath = '',
}: UseFetchResourceParams<T, R, Id>) {
	useReloadPageOnPopState()
	const { handleWithAbortSignal } = useAbortController()
	const { updatePathHistoryWithMeta } = useContext(SiteMetaContext)
	const [fetchResult, setFetchResult] = useState<R>(initialResult)
	const [apiSearchParams, setApiSearchParams] = useState<ApiSearchParams>(
		() => fromURLSearchParams(availableSearchParamsKeys),
	)

	const fetchTargetResource = useCallback(
		async (targetResourceKey: T, params: ApiSearchParams, id?: Id) => {
			return handleWithAbortSignal((signal) => {
				if (id && apiServicesWithId) {
					return apiServicesWithId[targetResourceKey]?.(id, params, signal)
				}

				if (apiServices) {
					return apiServices[targetResourceKey]?.(params, signal)
				}

				return Promise.resolve(null)
			})
		},
		[apiServices, apiServicesWithId, handleWithAbortSignal],
	)

	const handleFetchResource = useCallback(
		async (targetResourceKey: T, options?: HandleFetchResourceOptions<Id>) => {
			const { id, params, pathToPush, replaceParams = false } = options ?? {}

			const newParams: Partial<Record<string, unknown>> = updateSearchParamsObject(
				params,
				apiSearchParams,
				{ isReplace: replaceParams },
			)

			try {
				const result = await fetchTargetResource(targetResourceKey, newParams, id)

				if (result) {
					let path: string

					if (pathToPush) {
						path = pathToPush
					} else if (typeof resourceKeyToPath === 'string') {
						path = `${resourceKeyToPath}/${targetResourceKey}`
					} else if (typeof resourceKeyToPath === 'function') {
						path = resourceKeyToPath(targetResourceKey, id)
					} else {
						path = resourceKeyToPath?.[targetResourceKey]
					}

					path && updatePathHistoryWithMeta(path, { i18nMetaParams, searchParams: newParams })
					setFetchResult(result)
					setApiSearchParams(newParams)
				}

				return Promise.resolve()
			} catch (error) {
				return Promise.reject(error)
			}
		}, [
			apiSearchParams, fetchTargetResource, i18nMetaParams,
			resourceKeyToPath, updatePathHistoryWithMeta,
		],
	)

	return { apiSearchParams, fetchResult, handleFetchResource }
}

export default useFetchResource
