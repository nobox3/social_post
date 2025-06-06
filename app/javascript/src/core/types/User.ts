import Post from 'src/core/types/Post'

type User = {
	avatar_url?: string
	followers_count?: number
	followings_count?: number
	id: number
	posts?: Post[]
	relationship_id?: number
	slug?: string
	url?: string
	username?: string
}

export default User
