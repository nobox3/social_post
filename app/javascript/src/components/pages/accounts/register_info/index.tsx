import { Divider, Stack, Button, Box } from '@mui/material'
import { useContext } from 'react'

import ButtonWithProcessing from 'src/components/atoms/ButtonWithProcessing'
import useTranslationWithModel from 'src/components/hooks/useTranslationWithModel'
import EditEmail from 'src/components/pages/accounts/register_info/EditEmail'
import EditPassword from 'src/components/pages/accounts/register_info/EditPassword'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { RegisterInfo } from 'src/services/accountService'
import { deleteAuthProvider } from 'src/services/authProviderService'
import { deleteUser } from 'src/services/userAuthService'

type Props = {
	register_info?: RegisterInfo
}

function RegisterInfoIndex({ register_info }: Props) {
	const { t, tModel } = useTranslationWithModel()
	const { showModal } = useContext(ModalContext)
	const { auth_providers, email, password_set_by_system } = register_info ?? {}

	return (
		<Stack spacing={3}>
			<EditEmail defaultValue={email} />
			{auth_providers && auth_providers.length > 0 && (
				<>
					<Divider />
					<Stack>
						{auth_providers.map((authProvider) => {
							const { id, provider } = authProvider

							return (
								<ButtonWithProcessing
									key={id}
									handleInProcessing={() => deleteAuthProvider(id)}
									processingKey="delete_auth_provider"
								>
									{t('user.auth.delete_provider', { provider: tModel('auth_provider', 'provider', provider) })}
								</ButtonWithProcessing>
							)
						})}
					</Stack>
				</>
			)}
			{email && (
				<>
					<Divider />
					<EditPassword noCurrentPassword={password_set_by_system} />
				</>
			)}
			<Divider />
			<Box>
				<Button
					onClick={() => {
						showModal({
							closeButtonProps: 'default',
							enterButtonProps: {
								handleInProcessing: deleteUser,
								handleProcessingOptions: { redirectOnSuccess: true },
							},
							i18n: { itemKey: 'delete', scope: 'user.auth' },
							processingKey: 'delete_account',
						})
					}}
				>
					{t('user.auth.delete')}
				</Button>
			</Box>
		</Stack>
	)
}

export default RegisterInfoIndex
