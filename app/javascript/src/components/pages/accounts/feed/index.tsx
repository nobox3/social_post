import PostList, { Props as PostListProps } from 'src/components/molecules/PostList'
import Post from 'src/core/types/Post'
import { getFeed } from 'src/services/accountService'

type Props = Pick<PostListProps, 'resources' | 'totalCount'> & {
	draft_post?: Post
}

function FeedIndex({ draft_post, ...props }: Props) {
	return <PostList apiService={getFeed} draftPost={draft_post} isFeed {...props} />
}

export default FeedIndex
