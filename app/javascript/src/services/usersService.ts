import { httpClientFor } from 'src/core/axiosHttpClient'
import ApiSearchParams from 'src/core/types/ApiSearchParams'
import User from 'src/core/types/User'
import { PostsData } from 'src/services/postsService'

export type UsersData = {
	total_users_count: number
	users: User[]
}

export type UserData = {
	user?: User
}

type ApiParams = ApiSearchParams & {
	outset?: number
}

const api = httpClientFor('/api/users')

export async function getPosts(id: number, params: ApiParams, signal: AbortSignal) {
	const { data } = await api.get<PostsData>(`/${id}/posts`, { params, signal })

	return data
}

export async function getFollowings(id: number, params: ApiParams, signal: AbortSignal) {
	const { data } = await api.get<UsersData>(`/${id}/followings`, { params, signal })

	return data
}

export async function getFollowers(id: number, params: ApiParams, signal: AbortSignal) {
	const { data } = await api.get<UsersData>(`/${id}/followers`, { params, signal })

	return data
}
