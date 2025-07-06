import DOMPurify from 'dompurify'
import { TOptions } from 'i18next'
import { useCallback, createContext, ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AvailableLocale } from 'src/core/i18n/commonConfig'
import { LOCALE_LONG } from 'src/static/constants'
import { setMetaContents, setCanonicalUrl } from 'src/utils/metaUtils'
import {
	toDotChainPath, OnPathChangeParams,
	pushPathToHistory, replacePathHistory, ChangeHistoryPathOptions,
} from 'src/utils/urlUtils'

const sanitizeTranslation = (str: string) => {
	return DOMPurify.sanitize(str, { ALLOWED_ATTR: [], ALLOWED_TAGS: [] })
}

const I18N_META_PROPERTIES = ['description', 'keywords'] as const
type I18nMetaPropertyKey = (typeof I18N_META_PROPERTIES)[number]
type I18nMeta = Partial<Record<I18nMetaPropertyKey, string>>

type UpdateMetaParams = I18nMeta & Partial<OnPathChangeParams> & {
	image?: string
	locale?: AvailableLocale
	title: string
}

function updateMeta({
	description, image, keywords, locale, onlySearchChanged, pathWithSearch, title,
}: UpdateMetaParams) {
	const url = pathWithSearch ? window.location.origin + pathWithSearch : ''

	url && setCanonicalUrl(url)

	if (onlySearchChanged) {
		setMetaContents({ url }, 'property', 'og:')
	} else {
		document.title = title

		setMetaContents({ description, keywords }, 'name')
		setMetaContents({ description, image, locale: locale ? LOCALE_LONG[locale] : '', title, url }, 'property', 'og:')
		setMetaContents({ description, image, title }, 'name', 'twitter:')
	}
}

type UpdatePathHistoryWithMetaOptions = {
	i18nMetaParams?: I18nMetaParams
	isReplace?: boolean
	searchParams?: object | URLSearchParams
}

type SiteMetaProviderValue = {
	updateMetaOnLanguageChange: (locale: AvailableLocale) => void
	updateMetaOnPathChange: (changed: OnPathChangeParams, i18nMetaParams?: I18nMetaParams) => void
	updatePathHistoryWithMeta: (path: string, options?: UpdatePathHistoryWithMetaOptions) => void
}

export const SiteMetaContext = createContext<SiteMetaProviderValue>({
	updateMetaOnLanguageChange: () => {},
	updateMetaOnPathChange: () => {},
	updatePathHistoryWithMeta: () => {},
})

export type I18nParamsForPath = {
	interpolation?: Record<string, string>
	key: string
}

export type I18nMetaParams = Omit<I18nParamsForPath, 'key'> & {
	pathReplacements?: Record<number, string>
}

type Props = {
	children: ReactNode
	i18n_params_for_path: I18nParamsForPath
}

function SiteMetaProvider({ children, i18n_params_for_path }: Props) {
	const { t } = useTranslation()
	const [i18nParamsForPath, setI18nParamsForPath] = useState<I18nParamsForPath>(
		i18n_params_for_path,
	)

	const translateMeta = useCallback(
		(scope: string, itemKey: I18nMetaPropertyKey | 'page_name', i18nOptions: TOptions) => {
			// value が空のこともあるので key による fallback は使用しない
			return t(scope + itemKey, '', i18nOptions) || t(`${scope}default.${itemKey}`, '', i18nOptions)
		},
		[t],
	)

	const i18nMetaForPath = useCallback((params: I18nParamsForPath) => {
		const { interpolation, key } = params ?? {}

		const i18nOptions: TOptions = {
			...interpolation, interpolation: { escape: sanitizeTranslation },
		}

		const scope = `meta.${key}.`

		const i18nMeta = I18N_META_PROPERTIES.reduce<I18nMeta>((acc, itemKey) => {
			const content
          = translateMeta(scope, itemKey, i18nOptions) || t(`meta.default.${itemKey}`, i18nOptions)
			content && (acc[itemKey] = content)

			return acc
		}, {})

		const pageName = translateMeta(scope, 'page_name', i18nOptions)
		const title = t('meta.title')

		return { ...i18nMeta, title: pageName ? `${pageName} | ${title}` : title }
	}, [t, translateMeta])

	const updateMetaOnPathChange = useCallback((
		changed: OnPathChangeParams, i18nMetaParams?: I18nMetaParams,
	) => {
		const { pathWithSearch } = changed
		const { interpolation, pathReplacements } = i18nMetaParams ?? {}
		const i18nParams = { interpolation, key: toDotChainPath(pathWithSearch, pathReplacements) }

		updateMeta({ ...i18nMetaForPath(i18nParams), ...changed })
		setI18nParamsForPath(i18nParams)
	}, [i18nMetaForPath])

	const updateMetaOnLanguageChange = useCallback((locale: AvailableLocale) => {
		updateMeta({ ...i18nMetaForPath(i18nParamsForPath), locale })
	}, [i18nMetaForPath, i18nParamsForPath])

	const updatePathHistoryWithMeta = useCallback((
		path: string, options?: UpdatePathHistoryWithMetaOptions,
	) => {
		const { i18nMetaParams, isReplace = false, searchParams } = options ?? {}

		const opts: ChangeHistoryPathOptions = {
			onPathChange: (changed) => updateMetaOnPathChange(changed, i18nMetaParams),
			searchParams,
		}

		isReplace ? replacePathHistory(path, opts) : pushPathToHistory(path, opts)
	}, [updateMetaOnPathChange])

	const providerValue = useMemo<SiteMetaProviderValue>(() => {
		return { updateMetaOnLanguageChange, updateMetaOnPathChange, updatePathHistoryWithMeta }
	}, [updateMetaOnLanguageChange, updateMetaOnPathChange, updatePathHistoryWithMeta])

	return (
		<SiteMetaContext.Provider value={providerValue}>{children}</SiteMetaContext.Provider>
	)
}

export default SiteMetaProvider
