import { DeleteAttachmentParams } from 'src/components/hooks/useFileAttach'
import { httpClientFor } from 'src/core/axiosHttpClient'
import Attachment from 'src/core/types/Attachment'
import Post from 'src/core/types/Post'
import toFormData from 'src/utils/formData'

export type PostsData = {
	posts: Post[]
	total_posts_count: number
}

type PostData = {
	post?: Post
}

const api = httpClientFor('/api/posts')

export async function createPost(params: { body: string, send?: boolean }) {
	const { data } = await api.post<PostData>('', params)

	return data
}

export async function updatePost(id: number, params: { body: string, send?: boolean }) {
	const { data } = await api.put<PostData>(`/${id}`, params)

	return data
}

export async function deletePost(id: number) {
	const { data } = await api.delete(`/${id}`)

	return data
}

export async function attachFile(id: number, params: { file: File }) {
	const { data } = await api.put<{ attachment: Attachment }>(`/${id}/attach_file`, toFormData('', params))

	return data
}

export async function deleteAttachment(id: number, params?: DeleteAttachmentParams) {
	await api.put(`/${id}/delete_attachment`, params)
}
