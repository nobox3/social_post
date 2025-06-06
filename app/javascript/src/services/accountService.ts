import { httpClientFor } from 'src/core/axiosHttpClient'
import ApiSearchParams from 'src/core/types/ApiSearchParams'
import { PostsData } from 'src/services/postsService'
import { UsersData, UserData } from 'src/services/usersService'
import toFormData from 'src/utils/formData'

export type ProfileInfo = {
	avatar_url_large?: string
}

export type RegisterInfo = {
	auth_providers?: { id: number, provider: string }[]
	email?: string
	password_set_by_system?: boolean
}

type ApiParams = ApiSearchParams & {
	outset?: number
}

const api = httpClientFor('/api/account')

export async function getFeed(params: ApiParams, signal: AbortSignal) {
	const { data } = await api.get<PostsData>('/feed', { params, signal })

	return data
}

export async function getPosts(params: ApiParams, signal: AbortSignal) {
	const { data } = await api.get<PostsData>('/posts', { params, signal })

	return data
}

export async function getFollowings(params: ApiParams, signal: AbortSignal) {
	const { data } = await api.get<UsersData>('/followings', { params, signal })

	return data
}

export async function getFollowers(params: ApiParams, signal: AbortSignal) {
	const { data } = await api.get<UsersData>('/followers', { params, signal })

	return data
}

export async function getProfile(params: ApiSearchParams, signal: AbortSignal) {
	const { data } = await api.get<{ profile_info: ProfileInfo }>('/profile', { params, signal })

	return data
}

export async function getRegisterInfo(params: ApiSearchParams, signal: AbortSignal) {
	const { data } = await api.get<{ register_info: RegisterInfo }>('/register_info', { params, signal })

	return data
}

export async function getAppSettings(params: ApiSearchParams, signal: AbortSignal) {
	const { data } = await api.get<UserData>('/app_settings', { params, signal })

	return data
}

export async function updateUser(params: { avatar?: File, username?: string }) {
	const { data } = await api.put<UserData>('', toFormData('user', params))

	return data
}
