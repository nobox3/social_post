import i18next, { InitOptions as I18nextInitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { parseJsonMetaContent } from 'src/utils/metaUtils'

export type AvailableLocale = 'en' | 'ja'

type I18nLocaleInfo = {
	available_locales: AvailableLocale[]
	default_locale: AvailableLocale
	locale: AvailableLocale
}

const {
	available_locales = [], default_locale, locale,
} = parseJsonMetaContent<I18nLocaleInfo>('i18n-locale-info')

const languageDetector = new LanguageDetector()

const detectionOrder = [
	'querystring', 'cookie', 'sessionStorage', 'navigator', 'htmlTag',
]

if (locale) {
	const name = 'customDetector'

	languageDetector.addDetector({
		lookup(_options) {
			return locale
		},
		name,
	})

	detectionOrder.unshift(name)
}

i18next.use(HttpBackend).use(LanguageDetector).use(initReactI18next)

export const availableLocales = available_locales

type BackendOptions = HttpBackendOptions & { requestOptions?: { cache?: RequestCache } }

// NOTE: The interpolation's default prefix and suffix are '{{' and '}}',
// however other options were using the same interpolation syntax, so 'loadPath' is set following.
// https://github.com/i18next/next-i18next/issues/620
// "ns" means namespace.
export const initOptions: I18nextInitOptions<BackendOptions> = {
	backend: { loadPath: '/locales/%{lng}/%{ns}.json' },
	detection: { lookupCookie: 'locale', lookupQuerystring: 'locale', order: detectionOrder },
	fallbackLng: default_locale || 'dev',
	interpolation: { prefix: '%{', suffix: '}' },
	supportedLngs: available_locales,
}
