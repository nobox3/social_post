import { Stack, Divider, Typography, Box } from '@mui/material'

import useTranslationWithModel from 'src/components/hooks/useTranslationWithModel'
import LanguageSelect from 'src/components/molecules/LanguageSelect'
import ThemeSelect from 'src/components/molecules/ThemeSelect'

function AppSettingsIndex() {
	const { tModel } = useTranslationWithModel()

	return (
		<Stack spacing={3}>
			<Box>
				<Typography sx={{ marginBottom: 1 }}>{tModel('user', 'theme_mode')}</Typography>
				<ThemeSelect />
			</Box>
			<Divider />
			<LanguageSelect />
		</Stack>
	)
}

export default AppSettingsIndex
