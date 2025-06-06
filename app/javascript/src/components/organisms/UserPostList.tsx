import PostList, { Props as PostListProps } from 'src/components/molecules/PostList'

type Props = Pick<PostListProps, 'resources' | 'totalCount' | 'apiService' | 'apiServiceWithId' | 'id'>

function UserPostList({ ...props }: Props) {
	return <PostList {...props} />
}

export default UserPostList
