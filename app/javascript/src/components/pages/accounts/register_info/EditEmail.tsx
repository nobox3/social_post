import { useForm } from 'react-hook-form'

import EmailForm from 'src/components/atoms/EmailForm'
import AccountFormContainer from 'src/components/pages/accounts/AccountFormContainer'
import { updateRegistration } from 'src/services/userAuthService'

type FormInputs = {
	email: string
}

type Props = {
	defaultValue?: string
}

function EditEmail({ defaultValue }: Props) {
	const useFormReturn = useForm<FormInputs>({ defaultValues: { email: defaultValue } })

	return (
		<AccountFormContainer handleApi={updateRegistration} useFormReturn={useFormReturn}>
			<EmailForm name="email" useFormReturn={useFormReturn} />
		</AccountFormContainer>
	)
}

export default EditEmail
