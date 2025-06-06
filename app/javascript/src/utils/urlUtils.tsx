import { toStrSearchParams } from 'src/utils/searchParams'

const REGEXP = {
	AddHttpsPrefix: /^https?:\/\//,
	ConvertUrlsToLinks: /(https?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+)/,
	IsValidDomainName: /^([a-zA-Z0-9]\.|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/,
} as const

export function validateHttpDomain(value: string) {
	const url = value.trim()

	if (url === '') {
		return url
	}

	try {
		const urlObj = new URL(addHttpsPrefix(url))

		return isValidDomainName(urlObj.host) ? urlObj.href : null
	} catch {
		return null
	}
}

export function addHttpsPrefix(url: string): string {
	return REGEXP.AddHttpsPrefix.test(url) ? url : `https://${url}`
}

export function isValidDomainName(domainName: string): boolean {
	return domainName.length < 254 && REGEXP.IsValidDomainName.test(domainName)
}

type LinkOptions = {
	href?: string
	target?: string
}

export function splitPathname(index: number | null = null) {
	return splitPath(window.location.pathname, index)
}

export function splitPath(path: string, index: number | null = null): string | string[] {
	const segments = path === '/' ? [] : path.split('/').slice(1)

	return index === null ? segments : segments[index]
}

export function removeSegments(path: string, segments: string | string[]) {
	return path.replace(
		new RegExp(`/(${typeof segments === 'string' ? segments : segments.join('|')})`, 'g'),
		'',
	)
}

export function toDotChainPath(path: string) {
	return path.substring(1).replace(/\//g, '.')
}

export type OnPathChangeParams = {
	onlySearchChanged?: boolean
	pathWithSearch: string
}

export type ChangeHistoryPathOptions = {
	onPathChange?: (changed: OnPathChangeParams) => void
	searchParams?: object | URLSearchParams
}

export function pushPathToHistory(path: string, options?: ChangeHistoryPathOptions) {
	const pathWithSearch = path + toStrSearchParams(options?.searchParams)
	const state = window.history.state as { path?: string }

	if (state?.path !== pathWithSearch) {
		options?.onPathChange?.({ onlySearchChanged: state?.path?.startsWith(path), pathWithSearch })
		window.history.pushState({ path: pathWithSearch }, '', pathWithSearch)
	}
}

export function replacePathHistory(path: string, options?: ChangeHistoryPathOptions) {
	if (window.location.pathname !== path) {
		const pathWithSearch = path + toStrSearchParams(options?.searchParams)

		options?.onPathChange?.({ pathWithSearch })
		window.history.replaceState(null, '', pathWithSearch)
	}
}

function convertToLink(text: string, regexp: RegExp, linkOptions?: LinkOptions) {
	const href = linkOptions?.href
	const target = linkOptions?.target ?? '_blank'

	return text.split(regexp).map((str, index) => {
		if (regexp.test(str)) {
			return (
			// eslint-disable-next-line react/no-array-index-key
				<a key={index} href={href ?? str} target={target}>
					{str}
				</a>
			)
		}

		return str
	})
}

export function convertTextToLink(
	text: string,
	capture: string | { pattern: string, str: string },
	linkOptions?: LinkOptions,
) {
	if (typeof capture === 'string') {
		return convertToLink(text, new RegExp(`(${capture})`), linkOptions)
	}

	const { pattern, str } = capture

	return convertToLink(text.replace(pattern, str), new RegExp(`(${str})`), linkOptions)
}

export function convertUrlsToLinks(text: string, linkOptions?: LinkOptions) {
	return convertToLink(text, REGEXP.ConvertUrlsToLinks, linkOptions)
}
