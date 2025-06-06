import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import { Link, Stack, Divider, Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ButtonWithProcessing from 'src/components/atoms/ButtonWithProcessing'
import AuthForm from 'src/components/molecules/AuthForm'
import AuthWithProvider from 'src/components/molecules/AuthWithProvider'
import Panel from 'src/components/molecules/Panel'
import { signIn } from 'src/services/userAuthService'

function UsersSessionsNew() {
	const { t } = useTranslation()
	const [expandedLinks, setExpandedLinks] = useState<boolean>(false)

	return (
		<Panel maxWidth="sm" title={t('user.auth.login')}>
			<AuthWithProvider />
			<Divider sx={{ margin: '16px 0' }}>or</Divider>
			<AuthForm handleApi={signIn} />
			<Box sx={{ marginTop: '16px' }}>
				<Accordion
					disableGutters
					expanded={expandedLinks}
					sx={(theme) => ({ background: theme.palette.background.default, boxShadow: 'none' })}
				>
					<AccordionSummary
						expandIcon={<ExpandMoreOutlinedIcon />}
						onClick={(e) => {
							!(e.target instanceof HTMLAnchorElement) && setExpandedLinks((current) => !current)
						}}
						sx={(theme) => ({ columnGap: '8px', fontSize: theme.typography.body2.fontSize, padding: 0 })}
					>
						<Link href="/users/sign_up" sx={{ flexGrow: 1 }}>{t('user.auth.not_registered_yet')}</Link>
						<Typography variant="body2">{t('generic.other')}</Typography>
					</AccordionSummary>
					<AccordionDetails
						sx={(theme) => ({ fontSize: theme.typography.body2.fontSize, padding: 0 })}
					>
						<Stack spacing={1}>
							<Link href="/users/password/new">{t('user.auth.forgot_your_password')}</Link>
							<Link href="/users/confirmation/new">{t('user.auth.didn_t_receive_confirmation_instructions')}</Link>
							<Link href="/users/unlock/new">{t('user.auth.didn_t_receive_unlock_instructions')}</Link>
						</Stack>
					</AccordionDetails>
				</Accordion>
			</Box>
			<ButtonWithProcessing
				handleInProcessing={() => signIn({ email: 'user@example.com', password: 'password' })}
				handleProcessingOptions={{ redirectOnSuccess: true }}
				processingKey="user.auth"
				sx={{ marginTop: '24px' }}
			>
				デモユーザーでログイン
			</ButtonWithProcessing>
		</Panel>
	)
}

export default UsersSessionsNew
