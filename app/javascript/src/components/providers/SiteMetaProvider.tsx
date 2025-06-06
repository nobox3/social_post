import DOMPurify, { Config } from 'dompurify'
import { TOptions } from 'i18next'
import { useCallback, createContext, ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AvailableLocale } from 'src/core/i18n/commonConfig'
import { LOCALE_LONG, SITE_NAME } from 'src/static/constants'
import { setMetaContents, setCanonicalUrl } from 'src/utils/metaUtils'
import {
	toDotChainPath, removeSegments, OnPathChangeParams,
	pushPathToHistory, replacePathHistory, ChangeHistoryPathOptions,
} from 'src/utils/urlUtils'

const SANITIZE_OPTIONS: Config = { ALLOWED_ATTR: [], ALLOWED_TAGS: [] } as const

// const I18N_META_PROPERTIES = ['title', 'description', 'keywords'] as const
const I18N_META_PROPERTIES = ['title', 'description'] as const
type I18nMeta = Partial<Record<typeof I18N_META_PROPERTIES[number], string>>

type UpdateMetaParams = I18nMeta & Partial<OnPathChangeParams> & {
	image?: string
	locale?: AvailableLocale
}

function updateMeta({
	description, image, locale, onlySearchChanged, pathWithSearch, title,
}: UpdateMetaParams) {
	const url = pathWithSearch ? window.location.origin + pathWithSearch : ''

	url && setCanonicalUrl(url)

	if (onlySearchChanged) {
		setMetaContents({ url }, 'property', 'og:')
	} else {
		document.title = `${title} | ${SITE_NAME}`

		setMetaContents({ description }, 'name')
		setMetaContents({ description, image, locale: locale ? LOCALE_LONG[locale] : '', title, url }, 'property', 'og:')
		setMetaContents({ description, image, title }, 'name', 'twitter:')
	}
}

type UpdatePathHistoryWithMetaOptions = {
	i18nMetaPrams?: I18nMetaParams
	isReplace?: boolean
	searchParams?: object | URLSearchParams
}

type SiteMetaProviderValue = {
	updateMetaOnLanguageChange: (locale: AvailableLocale) => void
	updateMetaOnPathChange: (changed: OnPathChangeParams, i18nMetaPrams?: I18nMetaParams) => void
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
	removedSegments?: string | string[]
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

	const i18nMeta = useCallback((params: I18nParamsForPath) => {
		const { interpolation, key } = params ?? {}

		const i18nOptions: TOptions = {
			...interpolation,
			interpolation: { escape: (str) => DOMPurify.sanitize(str, SANITIZE_OPTIONS) },
		}

		return I18N_META_PROPERTIES.reduce<I18nMeta>((acc, name) => {
			const content = t([`meta.${key}.${name}`, `meta.default.${name}`], '', i18nOptions)
			content && (acc[name] = content)

			return acc
		}, {})
	}, [t])

	const updateMetaOnPathChange = useCallback((
		changed: OnPathChangeParams, i18nMetaPrams?: I18nMetaParams,
	) => {
		const { pathWithSearch } = changed
		const { interpolation, removedSegments } = i18nMetaPrams ?? {}

		const i18nParams = {
			interpolation,
			key: toDotChainPath(
				removedSegments ? removeSegments(pathWithSearch, removedSegments) : pathWithSearch,
			),
		}

		updateMeta({ ...i18nMeta(i18nParams), ...changed })
		setI18nParamsForPath(i18nParams)
	}, [i18nMeta])

	const updateMetaOnLanguageChange = useCallback((locale: AvailableLocale) => {
		updateMeta({ ...i18nMeta(i18nParamsForPath), locale })
	}, [i18nMeta, i18nParamsForPath])

	const updatePathHistoryWithMeta = useCallback((
		path: string, options?: UpdatePathHistoryWithMetaOptions,
	) => {
		const { i18nMetaPrams, isReplace = false, searchParams } = options ?? {}

		const opts: ChangeHistoryPathOptions = {
			onPathChange: (changed) => updateMetaOnPathChange(changed, i18nMetaPrams),
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
