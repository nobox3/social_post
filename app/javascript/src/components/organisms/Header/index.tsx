import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { AppBar, Container, Toolbar, Typography, Box, IconButton } from '@mui/material'
import { useContext, useState, ReactNode } from 'react'

import UserAvatar from 'src/components/molecules/UserAvatar'
import AccountMenu from 'src/components/organisms/Header/AccountMenu'
import GuestMenu from 'src/components/organisms/Header/GuestMenu'
import { CurrentUserContext } from 'src/components/providers/CurrentUserProvider'

export type HeaderItem = { href: string, icon: ReactNode, label: string }

const HEADER_ITEMS = [
	{ href: '/account/feed', icon: <HomeOutlinedIcon />, label: 'Home' },
]

function HeaderIndex() {
	const { currentUser, isSignedIn } = useContext(CurrentUserContext)
	const [avatarAnchor, setAvatarAnchor] = useState<null | HTMLElement>(null)

	return (
		<>
			<AppBar color="inherit" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Typography
							component="a"
							href={isSignedIn ? '/account/feed' : '/users/sign_in'}
							noWrap
							sx={{
								color: 'inherit', fontFamily: 'monospace', fontWeight: 'bold',
								letterSpacing: '.2rem', mr: 2, textDecoration: 'none',
							}}
							variant="h6"
						>
							SOCIAL POST
						</Typography>
						<Box sx={{ flexGrow: 1 }}>
							{isSignedIn && HEADER_ITEMS.map((item) => {
								const { href, icon, label } = item

								return <IconButton key={label} href={href}>{icon}</IconButton>
							})}
						</Box>
						{isSignedIn ? (
							<>
								<UserAvatar onClick={(e) => setAvatarAnchor(e.currentTarget)} user={currentUser} />
								<AccountMenu anchorEl={avatarAnchor} setAnchorEl={setAvatarAnchor} />
							</>
						) : <GuestMenu />}
					</Toolbar>
				</Container>
			</AppBar>
			<Toolbar />
		</>
	)
}

export default HeaderIndex
