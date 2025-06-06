import { Avatar, AvatarProps, IconButton } from '@mui/material'
import { useMemo, SyntheticEvent } from 'react'

import User from 'src/core/types/User'
import { NO_AVATAR_COLORS } from 'src/static/constants'

const USERNAME_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g

type Props = Omit<AvatarProps, 'src'> & {
	avatarUrl?: string
	onClick?: (e: SyntheticEvent<HTMLElement>) => void
	user?: Partial<Pick<User, 'avatar_url' | 'username' | 'url'>> | null
}

function UserAvatar({ alt = 'user-avatar', avatarUrl, onClick, user, ...props }: Props) {
	const { avatar_url, url, username } = user ?? {}
	const src = avatarUrl ?? avatar_url

	const avatar = useMemo(() => {
		if (src) {
			return <Avatar alt={alt} src={src} {...props} />
		}

		// ユーザー名をUnicodeコードポイントに変換した1桁目の数字で背景色出し分け
		const bgcolor = NO_AVATAR_COLORS[Number(username?.codePointAt(0)?.toString().slice(-1)) || 0]
		const { sx, ...propsRest } = props

		return (
			<Avatar alt={alt} sx={{ ...sx, bgcolor }} {...propsRest}>
				{/* ユーザー名の最初の1文字表示時サロゲートペア（絵文字等）も1文字として扱えるよう変換 */}
				{username?.match(USERNAME_REGEXP)?.[0]}
			</Avatar>
		)
	}, [src, username, alt, props])

	const handleClick = onClick ?? (url
		? () => {
			window.location.href = url
		}
		: undefined)

	return (
		<IconButton onClick={handleClick} sx={handleClick ? undefined : { pointerEvents: 'none' }}>
			{avatar}
		</IconButton>
	)
}

export default UserAvatar
