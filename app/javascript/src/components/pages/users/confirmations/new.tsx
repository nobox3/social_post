import { useForm } from 'react-hook-form'

import EmailForm from 'src/components/atoms/EmailForm'
import FormContainer from 'src/components/molecules/FormContainer'
import Panel from 'src/components/molecules/Panel'
import { createConfirmationInstruction } from 'src/services/userAuthService'

function ConfirmationsNew() {
	const useFormReturn = useForm<{ email: string }>()

	return (
		<Panel maxWidth="sm">
			<FormContainer
				handleApi={createConfirmationInstruction}
				processingKey="user.auth.resend_confirmation_instructions"
				useFormReturn={useFormReturn}
			>
				<EmailForm name="email" useFormReturn={useFormReturn} />
			</FormContainer>
		</Panel>
	)
}

export default ConfirmationsNew
