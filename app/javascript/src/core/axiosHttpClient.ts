import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, RawAxiosResponseHeaders, AxiosResponseHeaders } from 'axios'

import FlashMessage from 'src/core/types/FlashMessage'
import { getCsrfToken } from 'src/utils/metaUtils'

const axiosHttpClient = axios.create()

// --------------------
// Request Interceptor
// --------------------
axiosHttpClient.interceptors.request.use(
	(config) => {
		config.headers['X-CSRF-Token'] = getCsrfToken()
		config.headers['X-Requested-With'] = 'XMLHttpRequest'

		return config
	},
	(error: AxiosError) => Promise.reject(error),
)

// --------------------
// Response Interceptor
// --------------------
type ApiResponseErrorData = {
	error?: string
	errors?: string | string[]
	redirect_path?: string
} | undefined

type ResponseErrorData = { errors: string[] | null } | undefined

export type ResponseError = AxiosError<ResponseErrorData>

export function extractErrorMessages(error: ResponseError, options?: { default?: () => string }) {
	return error.response?.data?.errors ?? [options?.default?.() ?? error.message]
}

function extractResponseErrors(error: AxiosError<ApiResponseErrorData>) {
	const data = error.response?.data
	let errors = data?.errors

	if (!errors) {
		errors = []
	} else if (typeof errors === 'string') {
		errors = [errors]
	}

	data?.error && errors.push(data.error)

	return errors.length > 0 ? errors : null
}

export function setInterceptorForResponseError(
	onError: (error: ResponseError) => ResponseError,
) {
	axiosHttpClient.interceptors.response.use(
		(response) => response,
		(error: AxiosError<ApiResponseErrorData>): Promise<ResponseError> => {
			const { response } = error

			if (!response) {
				return Promise.reject(onError({ ...error, response }))
			}

			const { data } = response

			if (data?.redirect_path) {
				window.location.href = data.redirect_path

				return Promise.reject(error)
			}

			return Promise.reject(onError({
				...error,
				response: { ...response, data: { errors: extractResponseErrors(error) } },
			}))
		},
	)
}

export function clearResponseInterceptors() {
	axiosHttpClient.interceptors.response.clear()
}

// --------------------
// HTTP Client wrapper
// --------------------
export type ResponseData = {
	flash_message?: FlashMessage
	redirect_path?: string
	redirect_url?: string
}

type ApiResponse<T> = AxiosResponse<T & ResponseData> & {
	data: T
	headers: (RawAxiosResponseHeaders | AxiosResponseHeaders) & { location?: string }
}

type Data = object | FormData

class AxiosHttpClient {
	public config?: AxiosRequestConfig

	constructor(baseURL?: string) {
		if (baseURL) {
			this.config = { baseURL }
		}
	}

	public get<T>(url?: string, config?: AxiosRequestConfig) {
		return axiosHttpClient.get<T, ApiResponse<T>>(url ?? '', { ...this.config, ...config })
	}

	public post<T>(url?: string, data?: Data, config?: AxiosRequestConfig) {
		return axiosHttpClient.post<T, ApiResponse<T>>(url ?? '', data, { ...this.config, ...config })
	}

	public put<T>(url: string, data?: Data, config?: AxiosRequestConfig) {
		return axiosHttpClient.put<T, ApiResponse<T>>(url ?? '', data, { ...this.config, ...config })
	}

	public delete<T>(url: string, config?: AxiosRequestConfig) {
		return axiosHttpClient.delete<T, ApiResponse<T>>(url ?? '', { ...this.config, ...config })
	}
}

export function httpClientFor(baseURL?: string) {
	return new AxiosHttpClient(baseURL)
}
