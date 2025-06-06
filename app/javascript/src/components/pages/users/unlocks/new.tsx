import { useForm } from 'react-hook-form'

import EmailForm from 'src/components/atoms/EmailForm'
import FormContainer from 'src/components/molecules/FormContainer'
import Panel from 'src/components/molecules/Panel'
import { createUnlockInstruction } from 'src/services/userAuthService'

function UnlocksNew() {
	const useFormReturn = useForm<{ email: string }>()

	return (
		<Panel maxWidth="sm">
			<FormContainer
				handleApi={createUnlockInstruction}
				processingKey="user.auth.resend_unlock_instructions"
				useFormReturn={useFormReturn}
			>
				<EmailForm name="email" useFormReturn={useFormReturn} />
			</FormContainer>
		</Panel>
	)
}

export default UnlocksNew
