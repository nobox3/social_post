import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PasswordIcon from '@mui/icons-material/Password'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { Stack, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material'
import { MouseEventHandler, useCallback, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { signOut } from 'src/services/userAuthService'

function ListComponent() {
	const { t } = useTranslation()

	const renderListItem = useCallback((
		name: string, icon: ReactNode, onClick?: MouseEventHandler<HTMLDivElement>,
	) => {
		return (
			<ListItem disablePadding>
				<ListItemButton onClick={onClick}>
					<ListItemIcon>
						{icon}
					</ListItemIcon>
					<ListItemText primary={name} />
				</ListItemButton>
			</ListItem>
		)
	}, [])

	return (
		<Stack spacing={2}>
			<List>
				{renderListItem(t('user.change_profile'), <AccountBoxOutlinedIcon />)}
				{renderListItem(t('user.change_password'), <PasswordIcon />)}
				{renderListItem(t('user.setting'), <SettingsOutlinedIcon />)}
				<Divider />
				{renderListItem(t('generic.logout'), <LogoutOutlinedIcon />, async () => {
					await signOut()
					window.location.href = '/'
				})}
			</List>
		</Stack>
	)
}

export default ListComponent
