import { Stack } from '@mui/material'
import { useCallback, useState } from 'react'

import useInfiniteScroll, { UseInfiniteScrollParams } from 'src/components/hooks/useInfiniteScroll'
import useOnArrayStateChange from 'src/components/hooks/useOnArrayStateChange'
import PostItem, { parsePostBody } from 'src/components/molecules/PostItem'
import PostForm from 'src/components/pages/accounts/feed/PostForm'
import Post from 'src/core/types/Post'
import { PostsData } from 'src/services/postsService'

export type Props =
	Pick<UseInfiniteScrollParams<Post, PostsData>, 'apiService' | 'apiServiceWithId' | 'id'> & {
		draftPost?: Post
		isFeed?: boolean
		resources?: Post[]
		totalCount?: number
	}

function PostList({
	draftPost, isFeed = false,
	resources: initialResources = [], totalCount: initialTotalCount = 0, ...props
}: Props) {
	const [resources, onResourcesChange] = useOnArrayStateChange<Post>(
		() => initialResources.map(parsePostBody), { parseItem: parsePostBody },
	)
	const [totalCount, setTotalCount] = useState<number>(initialTotalCount)
	const [postMenuAnchor, setPostMenuAnchor] = useState<null | HTMLElement>(null)

	const onAddResources = useCallback(({ posts, total_posts_count }: PostsData) => {
		setTotalCount(total_posts_count)

		return { resources: posts }
	}, [])

	const { getEndTargetElementRef } = useInfiniteScroll({
		onAddResources, resourcesCount: resources.length, setResources: onResourcesChange, ...props,
	})

	return (
		<Stack spacing={2}>
			{isFeed && (
				<PostForm
					draftPost={draftPost}
					onPostsChange={onResourcesChange}
					setTotalCount={setTotalCount}
				/>
			)}
			{resources.map((post, index) => {
				const { id } = post

				return (
					<div key={id} ref={getEndTargetElementRef(index, totalCount)}>
						<PostItem
							menuAnchorEl={postMenuAnchor}
							post={post}
							setMenuAnchorEl={setPostMenuAnchor}
							setResources={onResourcesChange}
							setTotalCount={setTotalCount}
						/>
					</div>
				)
			})}
		</Stack>
	)
}

export default PostList
