import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import CheckBoxForm from 'src/components/atoms/CheckBoxForm'
import EmailForm from 'src/components/atoms/EmailForm'
import PasswordForm from 'src/components/atoms/PasswordForm'
import useTranslationWithModel from 'src/components/hooks/useTranslationWithModel'
import FormContainer, { Props as FormContainerProps } from 'src/components/molecules/FormContainer'

export type FormInputs = {
	email: string
	password: string
	remember_me?: boolean
}

type Props = Omit<FormContainerProps<FormInputs>, 'processingKey' | 'useFormReturn' | 'title' | 'buttonProps'> & {
	isRegistration?: boolean
}

function AuthForm({ isRegistration = false, ...props }: Props) {
	const { t, tModel } = useTranslationWithModel()
	const useFormReturn = useForm<FormInputs>()
	const { setFocus } = useFormReturn

	useEffect(() => {
		setFocus('email')
	}, [setFocus])

	return (
		<FormContainer
			buttonProps={{ children: t('generic.continue') }}
			processingKey="user.auth"
			title=""
			useFormReturn={useFormReturn}
			{...props}
		>
			<EmailForm name="email" size="small" useFormReturn={useFormReturn} />
			<PasswordForm
				isNew={isRegistration}
				label={tModel('user', 'password')}
				name="password"
				size="small"
				useFormReturn={useFormReturn}
			/>
			{!isRegistration && (
				<CheckBoxForm
					label={tModel('user', 'remember_me')}
					name="remember_me"
					useFormReturn={useFormReturn}
				/>
			)}
		</FormContainer>
	)
}

export default AuthForm
