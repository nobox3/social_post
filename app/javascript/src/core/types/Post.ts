import Attachment from 'src/core/types/Attachment'
import User from 'src/core/types/User'

type Post = {
	body: string
	id: number
	images?: Attachment[]
	sent_at?: string
	url?: string
	user: User
}

export default Post
