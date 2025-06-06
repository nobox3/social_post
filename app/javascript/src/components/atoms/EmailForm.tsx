import { FieldValues } from 'react-hook-form'

import InputTextForm, { Props as InputTextFormProps } from 'src/components/atoms/InputTextForm'
import useTranslationWithModel from 'src/components/hooks/useTranslationWithModel'

type Props<T extends FieldValues> = Omit<InputTextFormProps<T>, 'type' | 'placeholder'>

function EmailForm<T extends FieldValues>({ required = true, ...props }: Props<T>) {
	const { tModel } = useTranslationWithModel()

	return (
		<InputTextForm
			label={tModel('user', 'email')}
			placeholder="mail@example.com"
			required={required}
			type="email"
			{...props}
		/>
	)
}

export default EmailForm
