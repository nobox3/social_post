import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import PasswordForm from 'src/components/atoms/PasswordForm'
import FormContainer from 'src/components/molecules/FormContainer'
import Panel from 'src/components/molecules/Panel'
import { resetPassword } from 'src/services/userAuthService'

function PasswordsEdit() {
	const { t } = useTranslation()
	const useFormReturn = useForm<{ password: string }>()
	const reset_password_token = new URLSearchParams(window.location.search).get(
		'reset_password_token',
	)

	return (
		<Panel maxWidth="sm">
			<FormContainer
				handleApi={(values) => resetPassword({ ...values, reset_password_token })}
				processingKey="user.auth.password_reset"
				useFormReturn={useFormReturn}
			>
				<PasswordForm
					isNew
					label={t('user.auth.new_password')}
					name="password"
					useFormReturn={useFormReturn}
				/>
			</FormContainer>
		</Panel>
	)
}

export default PasswordsEdit
