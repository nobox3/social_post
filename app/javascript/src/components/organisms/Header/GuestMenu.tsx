import { Typography, Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

import LanguageSelect from 'src/components/molecules/LanguageSelect'
import ThemeSelect from 'src/components/molecules/ThemeSelect'

function GuestMenu() {
	const { t } = useTranslation()

	return (
		<Stack direction="row" spacing={1}>
			<Button href="/users/sign_in" size="small" variant="contained">
				<Typography>{t('user.auth.login')}</Typography>
			</Button>
			<Button href="/users/sign_up" size="small" variant="contained">
				<Typography>{t('user.auth.signup')}</Typography>
			</Button>
			<ThemeSelect noItemLabel />
			<LanguageSelect />
		</Stack>
	)
}

export default GuestMenu
