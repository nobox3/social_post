import { httpClientFor } from 'src/core/axiosHttpClient'

const api = httpClientFor('/api/auth_providers')

export async function deleteAuthProvider(id: number) {
	const { data } = await api.delete(`/${id}`)

	return data
}
