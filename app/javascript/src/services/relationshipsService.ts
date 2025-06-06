import { httpClientFor } from 'src/core/axiosHttpClient'

const api = httpClientFor('/api/relationships')

export async function followUser(params: { followed_id: number }) {
	const { data } = await api.post<{ relationship_id: number }>('', params)

	return data
}

export async function unfollowUser(id: number) {
	const { data } = await api.delete(`/${id}`)

	return data
}
