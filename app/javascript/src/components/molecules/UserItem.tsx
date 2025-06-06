import { Card, CardContent, Typography, Stack } from '@mui/material'
import { ReactNode } from 'react'

import UserAvatar from 'src/components/molecules/UserAvatar'
import User from 'src/core/types/User'

type Props = {
	children?: ReactNode
	user: User
}

function UserItem({ children, user }: Props) {
	const { username } = user

	return (
		<Card>
			<CardContent>
				<Stack alignItems="center" direction="row" spacing={1}>
					<UserAvatar user={user} />
					<Typography sx={{ flexGrow: 1 }}>{username}</Typography>
					{children}
				</Stack>
			</CardContent>
		</Card>
	)
}

export default UserItem
