import { useForm } from 'react-hook-form'

import EmailForm from 'src/components/atoms/EmailForm'
import FormContainer from 'src/components/molecules/FormContainer'
import Panel from 'src/components/molecules/Panel'
import { createPasswordResetInstruction } from 'src/services/userAuthService'

function PasswordsNew() {
	const useFormReturn = useForm<{ email: string }>()

	return (
		<Panel maxWidth="sm">
			<FormContainer
				handleApi={createPasswordResetInstruction}
				processingKey="user.auth.send_me_reset_password_instructions"
				useFormReturn={useFormReturn}
			>
				<EmailForm name="email" useFormReturn={useFormReturn} />
			</FormContainer>
		</Panel>
	)
}

export default PasswordsNew
