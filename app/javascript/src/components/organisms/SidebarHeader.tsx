import { Stack, Typography, Divider } from '@mui/material'
import { ReactNode } from 'react'

import UserAvatar from 'src/components/molecules/UserAvatar'
import User from 'src/core/types/User'

type Props = {
	children?: ReactNode
	user: User
}

function SidebarHeader({ children, user }: Props) {
	const { username } = user

	return (
		<>
			<Stack alignItems="center" spacing={1} sx={{ marginBottom: 2, marginTop: 2 }}>
				<UserAvatar sx={{ height: 72, width: 72 }} user={user} />
				<Typography>{username}</Typography>
				{children}
			</Stack>
			<Divider />
		</>
	)
}

export default SidebarHeader
