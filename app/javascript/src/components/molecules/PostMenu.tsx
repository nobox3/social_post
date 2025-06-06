import { Menu, MenuItem } from '@mui/material'
import { Dispatch, SetStateAction, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ModalContext } from 'src/components/providers/ModalProvider'
import Post from 'src/core/types/Post'
import { deletePost } from 'src/services/postsService'

export type Props = {
	menuAnchorEl: HTMLElement | null
	postId: number
	setMenuAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
	setResources: (changed: ((current: Post[]) => Post[])) => void
	setTotalCount: Dispatch<SetStateAction<number>>
}

function PostMenu({ menuAnchorEl, postId, setMenuAnchorEl, setResources, setTotalCount }: Props) {
	const { t } = useTranslation()
	const { showModal } = useContext(ModalContext)

	return (
		<Menu
			anchorEl={menuAnchorEl}
			onClose={() => setMenuAnchorEl(null)}
			open={Boolean(menuAnchorEl)}
		>
			<MenuItem onClick={async () => {
				showModal({
					closeButtonProps: 'default',
					enterButtonProps: {
						color: 'error',
						handleInProcessing: () => deletePost(postId),
						onClick: () => {
							setResources((current) => current.filter((post) => post.id !== postId))
							setTotalCount((current) => current - 1)
							setMenuAnchorEl(null)
						},
					},
					i18n: { itemKey: 'delete', scope: 'post' },
					processingKey: `delete_post_${postId}`,
				})
			}}
			>
				{t('generic.delete')}
			</MenuItem>
		</Menu>
	)
}

export default PostMenu
