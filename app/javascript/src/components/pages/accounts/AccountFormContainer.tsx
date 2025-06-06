import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormContainer, { Props as FormContainerProps } from 'src/components/molecules/FormContainer'
import { ResponseData } from 'src/core/axiosHttpClient'

function AccountFormContainer<T extends FieldValues, R = ResponseData>({
	buttonProps,
	children,
	title = '',
	...props
}: Omit<FormContainerProps<T, R>, 'processingKey'>) {
	const { t } = useTranslation()

	return (
		<FormContainer<T, R>
			buttonProps={
				buttonProps === null
					? null
					: { children: t('generic.update'), size: 'small', ...buttonProps }
			}
			processingKey="update_account"
			title={title}
			{...props}
		>
			{children}
		</FormContainer>
	)
}

export default AccountFormContainer
