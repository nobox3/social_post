import { Checkbox, FormControlLabel } from '@mui/material'
import { ReactNode } from 'react'
import { FieldValues, RegisterOptions } from 'react-hook-form'

import FormItem, { Props as FormItemProps } from 'src/components/atoms/FormItem'
import useReactHookFormValidations from 'src/components/hooks/useReactHookFormValidations'

type Props<T extends FieldValues> = FormItemProps<T> & {
	label?: ReactNode
	registerOptions?: RegisterOptions<T>
}

function CheckBoxForm<T extends FieldValues>({ label, registerOptions, ...props }: Props<T>) {
	const { name, required, useFormReturn } = props
	const { register } = useFormReturn

	const registerOptionsFromHook = useReactHookFormValidations<T>({
		required, targetOptions: registerOptions,
	})

	const { onChange, ...registerReturnRest } = register(name, registerOptionsFromHook)

	return (
		<FormItem {...props}>
			<FormControlLabel
				control={<Checkbox onChange={onChange} slotProps={{ input: registerReturnRest }} />}
				label={label}
				required={required}
			/>
		</FormItem>
	)
}

export default CheckBoxForm
