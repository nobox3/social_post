import { createContext, useContext, useState, useCallback, useMemo, Dispatch, SetStateAction, ReactNode } from 'react'

import { FlashMessageContext } from 'src/components/providers/FlashMessageProvider'
import { ResponseData } from 'src/core/axiosHttpClient'

export type ApiReturn<T> = T extends void ? T : T & ResponseData

export type HandleProcessingOptions = {
	redirectOnSuccess?: boolean | '_blank'
	suppressFlashMessage?: boolean
}

type HandleProcessing = <T>(
	processingKey: string,
	handleInProcessing: () => Promise<ApiReturn<T>>,
	options?: HandleProcessingOptions
) => Promise<ApiReturn<T>>

type ProcessingKeys = Record<string, boolean>

type ProcessingProviderValue = {
	handleProcessing: HandleProcessing
	isProcessing: (key: string | ((key: string) => boolean) | undefined) => boolean
	setProcessingKeys: Dispatch<SetStateAction<ProcessingKeys>>
}

export const ProcessingContext = createContext<ProcessingProviderValue>({
	handleProcessing: async <T,>() => Promise.resolve() as Promise<ApiReturn<T>>,
	isProcessing: () => false,
	setProcessingKeys: () => {},
})

type Props = {
	children: ReactNode
}

function ProcessingProvider({ children }: Props) {
	const addFlashMessages = useContext(FlashMessageContext)
	const [processingKeys, setProcessingKeys] = useState<ProcessingKeys>({})

	const removeProcessingKey = useCallback((processingKey: string) => {
		const keys: ProcessingKeys = {}

		setProcessingKeys((current) => {
			return Object.entries(current).reduce((acc, [k, v]) => {
				k !== processingKey && (acc[k] = v)

				return acc
			}, keys)
		})
	}, [])

	const handleProcessing = useCallback(
		async <T,>(
			processingKey: string,
			handleInProcessing: () => Promise<ApiReturn<T>>,
			options?: HandleProcessingOptions,
		) => {
			setProcessingKeys((current) => ({ ...current, [processingKey]: true }))

			try {
				const result = await handleInProcessing()

				if (!result) {
					removeProcessingKey(processingKey)
					return result
				}

				const { redirectOnSuccess = false, suppressFlashMessage = false } = options ?? {}

				if (redirectOnSuccess) {
					const { redirect_path, redirect_url } = result
					const href = redirect_url || redirect_path

					if (href) {
						if (redirectOnSuccess === '_blank') {
							window.open(href, redirectOnSuccess, 'noopener,noreferrer')
							removeProcessingKey(processingKey)
						} else {
							window.location.href = href
						}

						return result
					}
				}

				if (!suppressFlashMessage && result.flash_message) {
					addFlashMessages(result.flash_message)
				}

				removeProcessingKey(processingKey)
				return result
			} catch (error) {
				removeProcessingKey(processingKey)
				return Promise.reject(error)
			}
		},
		[addFlashMessages, removeProcessingKey],
	)

	const isProcessing = useCallback(
		(key: string | ((key: string) => boolean) | undefined) => {
			if (!key) {
				return false
			}

			if (typeof key === 'function') {
				return Object.keys(processingKeys).some(key)
			}

			return !!processingKeys[key]
		},
		[processingKeys],
	)

	const providerValue = useMemo<ProcessingProviderValue>(() => {
		return { handleProcessing, isProcessing, setProcessingKeys }
	}, [handleProcessing, isProcessing])

	return <ProcessingContext.Provider value={providerValue}>{children}</ProcessingContext.Provider>
}

export default ProcessingProvider
