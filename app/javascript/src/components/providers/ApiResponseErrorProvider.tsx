import { useMemo, useState, createContext, ReactNode, useEffect, Dispatch, SetStateAction } from 'react'

import { clearResponseInterceptors, ResponseError, setInterceptorForResponseError } from 'src/core/axiosHttpClient'

type ApiResponseErrorProviderValue = {
	responseError: ResponseError | null
	setResponseError: Dispatch<SetStateAction<ResponseError | null>>
}

export const ApiResponseErrorContext = createContext<ApiResponseErrorProviderValue>({
	responseError: null,
	setResponseError: () => {},
})

type Props = {
	children: ReactNode
}

function ApiResponseErrorProvider({ children }: Props) {
	const [responseError, setResponseError] = useState<ResponseError | null>(null)

	useEffect(() => {
		setInterceptorForResponseError((error: ResponseError) => {
			setResponseError(error)

			return error
		})

		return () => clearResponseInterceptors()
	}, [])

	const providerValue = useMemo<ApiResponseErrorProviderValue>(() => {
		return { responseError, setResponseError }
	}, [responseError])

	return (
		<ApiResponseErrorContext.Provider value={providerValue}>
			{children}
		</ApiResponseErrorContext.Provider>
	)
}

export default ApiResponseErrorProvider
