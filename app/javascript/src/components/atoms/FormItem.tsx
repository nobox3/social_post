import { FormControl, FormHelperText } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import { ReactNode } from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

export type Props<T extends FieldValues> = {
	children?: ReactNode
	name: Path<T>
	required?: boolean
	size?: OverridableStringUnion<'small' | 'medium'>
	sx?: object
	useFormReturn: UseFormReturn<T>
}

function FormItem<T extends FieldValues>({
	children, name, required = false, size, sx, useFormReturn,
}: Props<T>) {
	const { formState: { errors } } = useFormReturn
	const errorMessage = errors[name]?.message

	return (
		<FormControl error={!!errorMessage} required={required} size={size} sx={sx}>
			{children}
			{typeof errorMessage === 'string' && <FormHelperText>{errorMessage}</FormHelperText>}
		</FormControl>
	)
}

export default FormItem
