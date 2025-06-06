import { OutlinedInput, InputLabel } from '@mui/material'
import { ReactNode, useId } from 'react'
import { FieldValues, RegisterOptions } from 'react-hook-form'

import FormItem, { Props as FormItemProps } from 'src/components/atoms/FormItem'
import useReactHookFormValidations from 'src/components/hooks/useReactHookFormValidations'
import { MAX_TEXT_COUNT } from 'src/static/constants'

export type Props<T extends FieldValues> = FormItemProps<T> & {
	endAdornment?: ReactNode
	label?: ReactNode
	maxLength?: number
	minLength?: number
	placeholder?: string
	registerOptions?: RegisterOptions<T>
	type?: string
}

function InputTextForm<T extends FieldValues>({
	endAdornment, label, maxLength = MAX_TEXT_COUNT, minLength,
	placeholder, registerOptions, type, ...props
}: Props<T>) {
	const id = useId()
	const { name, required, useFormReturn } = props
	const { formState: { defaultValues }, register } = useFormReturn

	const registerOptionsFromHook = useReactHookFormValidations<T>({
		maxLength, minLength, required, targetOptions: registerOptions,
	})

	return (
		<FormItem<T> {...props}>
			{label && <InputLabel htmlFor={id}>{label}</InputLabel>}
			<OutlinedInput
				defaultValue={defaultValues?.[name]}
				endAdornment={endAdornment}
				id={id}
				inputProps={register(name, registerOptionsFromHook)}
				label={label}
				placeholder={placeholder}
				type={type}
			/>
		</FormItem>
	)
}

export default InputTextForm
