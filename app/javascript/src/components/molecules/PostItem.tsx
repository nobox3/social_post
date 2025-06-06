import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Card, CardHeader, CardContent, Typography, IconButton } from '@mui/material'
import { Dispatch, SetStateAction, useContext, ReactNode } from 'react'

import ImageList from 'src/components/molecules/ImageList'
import PostMenu from 'src/components/molecules/PostMenu'
import UserAvatar from 'src/components/molecules/UserAvatar'
import { CurrentUserContext } from 'src/components/providers/CurrentUserProvider'
import TPost from 'src/core/types/Post'
import { convertUrlsToLinks } from 'src/utils/urlUtils'

export type Post = TPost & {
	parsedBody?: ReactNode[]
}

export const parsePostBody = (post: Post) => {
	if (post.parsedBody) {
		return post
	}

	return { ...post, parsedBody: convertUrlsToLinks(post.body ?? '') }
}

type Props = {
	menuAnchorEl: HTMLElement | null
	post: Post
	setMenuAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
	setResources: (changed: ((current: Post[]) => Post[])) => void
	setTotalCount: Dispatch<SetStateAction<number>>
}

function PostItem({ menuAnchorEl, post, setMenuAnchorEl, setResources, setTotalCount }: Props) {
	const { isCurrentUser } = useContext(CurrentUserContext)
	const { body, images, parsedBody, sent_at, user } = post
	const { username } = user
	const isPostOwner = isCurrentUser(user)

	return (
		<Card sx={(theme) => ({ maxWidth: theme.breakpoints.values.md })}>
			<CardHeader
				action={isPostOwner && (
					<IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
						<MoreHorizOutlinedIcon />
					</IconButton>
				)}
				avatar={<UserAvatar user={user} />}
				subheader={sent_at}
				title={username}
			/>
			{isPostOwner && (
				<PostMenu
					menuAnchorEl={menuAnchorEl}
					postId={post.id}
					setMenuAnchorEl={setMenuAnchorEl}
					setResources={setResources}
					setTotalCount={setTotalCount}
				/>
			)}
			<CardContent>
				<Typography sx={{ overflowWrap: 'break-word' }}>
					{parsedBody ?? body}
				</Typography>
				{images && images.length > 0 && <ImageList images={images} />}
			</CardContent>
		</Card>
	)
}

export default PostItem
