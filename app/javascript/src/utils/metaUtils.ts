type MetaAttribute = 'name' | 'property'

export function getMeta(name: string, attribute: MetaAttribute = 'name') {
	return document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
}

export function getMetaContent(name: string) {
	return getMeta(name)?.content
}

export function getCsrfToken() {
	return getMetaContent('csrf-token')
}

export function parseJsonMetaContent<T = object>(name: string): Partial<T> {
	const parsed: unknown = JSON.parse(getMetaContent(name) || '{}')

	return parsed !== null && typeof parsed === 'object' ? parsed : {}
}

export function setMetaContents(params: Partial<Record<string, string>>, attribute: MetaAttribute, namePrefix = '') {
	Object.entries(params).forEach(([name, content]) => {
		content && getMeta(namePrefix + name, attribute)?.setAttribute('content', content)
	})
}

export function setCanonicalUrl(url: string) {
	const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')

	link && link.setAttribute('href', url)
}
