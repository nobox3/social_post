import { httpClientFor } from 'src/core/axiosHttpClient'
import { AvailableLocale } from 'src/core/i18n/commonConfig'

const api = httpClientFor('/api/app_settings')

export async function updateLocale(params: { language: AvailableLocale }) {
	await api.put('/update_locale', params)
}

export async function updateThemeMode(params: { theme_mode: string }) {
	await api.put('/update_theme_mode', params)
}
