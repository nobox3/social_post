import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import PasswordForm from 'src/components/atoms/PasswordForm'
import AccountFormContainer from 'src/components/pages/accounts/AccountFormContainer'
import { updateRegistration } from 'src/services/userAuthService'

type FormInputs = {
	current_password: string
	password: string
}

type Props = {
	noCurrentPassword?: boolean
}

function EditPassword({ noCurrentPassword = false }: Props) {
	const { t } = useTranslation()
	const useFormReturn = useForm<FormInputs>()
	const { resetField } = useFormReturn
	const commonProps = { modelName: 'user', useFormReturn }

	return (
		<AccountFormContainer
			handleApi={updateRegistration}
			onSubmitSucceeded={() => {
				resetField('current_password')
				resetField('password')
			}}
			useFormReturn={useFormReturn}
		>
			{!noCurrentPassword && <PasswordForm label={t('user.auth.current_password')} name="current_password" {...commonProps} /> }
			<PasswordForm isNew label={t('user.auth.new_password')} name="password" {...commonProps} />
		</AccountFormContainer>
	)
}

export default EditPassword
