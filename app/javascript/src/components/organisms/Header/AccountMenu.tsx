import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PasswordIcon from '@mui/icons-material/Password'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { Menu, MenuItem, ListItemIcon, Box, Divider } from '@mui/material'
import { useCallback, useContext, Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { ListItem } from 'src/components/organisms/NavItem'
import { ProcessingContext } from 'src/components/providers/ProcessingProvider'
import { signOut } from 'src/services/userAuthService'

export const MENU_ITEM_KEYS = [
	'feed', 'posts', 'followings', 'followers',
	'profile', 'register_info', 'app_settings', 'logout',
] as const

export type MenuItemKey = typeof MENU_ITEM_KEYS[number]

export const MENU_ITEMS: Record<MenuItemKey, ListItem> = {
	app_settings: { i18nKey: 'user.account.app_settings', icon: <SettingsOutlinedIcon /> },
	feed: { i18nKey: 'user.account.feed', icon: <HomeOutlinedIcon /> },
	followers: { i18nKey: 'user.follower', icon: <PeopleOutlineOutlinedIcon /> },
	followings: { i18nKey: 'user.following', icon: <PeopleOutlineOutlinedIcon /> },
	logout: { i18nKey: 'user.auth.logout', icon: <LogoutOutlinedIcon /> },
	posts: { i18nKey: 'user.posts', icon: <FeedOutlinedIcon /> },
	profile: { i18nKey: 'user.account.profile', icon: <AccountBoxOutlinedIcon /> },
	register_info: { i18nKey: 'user.account.register_info', icon: <PasswordIcon /> },
} as const

type Props = {
	anchorEl: HTMLElement | null
	setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
}

function AccountMenu({ anchorEl, setAnchorEl }: Props) {
	const { t } = useTranslation()
	const { handleProcessing } = useContext(ProcessingContext)

	const handleClick = useCallback(async (key: MenuItemKey) => {
		switch (key) {
			case 'feed':
			case 'posts':
			case 'followings':
			case 'followers':
			case 'profile':
			case 'register_info':
			case 'app_settings':
				window.location.href = `/account/${key}`
				break
			case 'logout':
				await handleProcessing('sign_out', signOut, { redirectOnSuccess: true })
				break

			default:
				break
		}
	}, [handleProcessing])

	return (
		<Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)}>
			{MENU_ITEM_KEYS.map((key) => {
				const { i18nKey, icon } = MENU_ITEMS[key]

				return (
					<Box key={key}>
						{(key === 'profile' || key === 'logout') && <Divider />}
						<MenuItem onClick={() => handleClick(key)}>
							<ListItemIcon>
								{icon}
							</ListItemIcon>
							{t(i18nKey)}
						</MenuItem>
					</Box>
				)
			})}
		</Menu>
	)
}

export default AccountMenu
