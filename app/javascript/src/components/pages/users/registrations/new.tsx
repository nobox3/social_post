import { Typography, Link, Box, Divider } from '@mui/material'
import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import AuthForm from 'src/components/molecules/AuthForm'
import AuthWithProvider from 'src/components/molecules/AuthWithProvider'
import Panel from 'src/components/molecules/Panel'
import { UserThemeModeContext } from 'src/components/providers/UserThemeProvider'
import FlashMessage from 'src/core/types/FlashMessage'
import { signUp } from 'src/services/userAuthService'

function UsersRegistrationsNew() {
	const { t } = useTranslation()
	const { userThemeMode } = useContext(UserThemeModeContext)
	const [notice, setNotice] = useState<FlashMessage | undefined>(undefined)

	return (
		<Panel maxWidth="sm" title={t('user.auth.signup')}>
			{notice ? (
				<>
					<Typography>{notice.text}</Typography>
					<Box sx={{ marginTop: '24px' }}>
						<Link href="/users/confirmation/new" variant="body2">
							{t('user.auth.didn_t_receive_confirmation_instructions')}
						</Link>
					</Box>
				</>
			) : (
				<>
					<AuthWithProvider isRegistration />
					<Divider sx={{ margin: '16px 0' }}>or</Divider>
					<AuthForm
						handleApi={(values) => signUp({ ...values, theme_mode: userThemeMode })}
						handleProcessingOptions={{ suppressFlashMessage: true }}
						isRegistration
						onSubmitSucceeded={({ flash_message }) => setNotice(flash_message)}
					/>
					<Box sx={{ marginTop: '24px' }}>
						<Link href="/users/sign_in" variant="body2">{t('user.auth.already_have_account')}</Link>
					</Box>
				</>
			)}
		</Panel>
	)
}

export default UsersRegistrationsNew
