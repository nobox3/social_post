import { RegisterOptions, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

function useReactHookFormValidations<T extends FieldValues>(params: {
	maxLength?: number
	minLength?: number
	required?: boolean
	targetOptions?: RegisterOptions<T>
}) {
	const { t } = useTranslation()
	const { maxLength, minLength, required, targetOptions = {} } = params

	if (!targetOptions.required && required) {
		targetOptions.required = t('common_errors.empty')
	}

	if (!targetOptions.maxLength && maxLength) {
		targetOptions.maxLength = {
			message: t('common_errors.too_long', { count: maxLength }),
			value: maxLength,
		}
	}

	if (!targetOptions.minLength && minLength) {
		targetOptions.minLength = {
			message: t('common_errors.too_short', { count: minLength }),
			value: minLength,
		}
	}

	return targetOptions
}

export default useReactHookFormValidations
