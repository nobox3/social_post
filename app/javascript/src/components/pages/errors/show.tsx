import { Typography, Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

import Panel from 'src/components/molecules/Panel'

type Props = {
	status: number
}

function ErrorsShow({ status }: Props) {
	const { t } = useTranslation()

	return (
		<Panel maxWidth="sm" textAlign="center" title={`${status}`}>
			<Stack spacing={1} sx={{ alignItems: 'center' }}>
				<Typography variant="h5">{t(`system_errors.code_${status}_sub`)}</Typography>
				<Typography>{t(`system_errors.code_${status}`)}</Typography>
				<Button href="/" variant="outlined">{t('generic.back_to_home')}</Button>
			</Stack>
		</Panel>
	)
}

export default ErrorsShow
