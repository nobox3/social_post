import { httpClientFor } from 'src/core/axiosHttpClient'

const api = httpClientFor('/api/attachments')

export async function getViewerImage(id: number) {
	const { data } = await api.get<{ url: string }>(`${id}/viewer_image`)

	return data
}
