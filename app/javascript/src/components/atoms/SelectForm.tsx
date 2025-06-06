import { MenuItem, Select, InputLabel } from '@mui/material'
import { useId, ReactNode } from 'react'
import { FieldValues, RegisterOptions } from 'react-hook-form'

import FormItem, { Props as FormItemProps } from 'src/components/atoms/FormItem'
import useReactHookFormValidations from 'src/components/hooks/useReactHookFormValidations'

export type Props<T extends FieldValues, V extends string | number> = FormItemProps<T> & {
	itemLabel?: ((value: V) => ReactNode)
	label?: ReactNode
	registerOptions?: RegisterOptions<T>
	values?: V[]
}

function SelectForm<T extends FieldValues, V extends string | number>({
	itemLabel, label, registerOptions, values, ...props
}: Props<T, V>) {
	const id = useId()
	const { name, required, useFormReturn } = props
	const { formState: { defaultValues }, register } = useFormReturn

	const registerOptionsFromHook = useReactHookFormValidations<T>({
		required, targetOptions: registerOptions,
	})

	return (
		<FormItem<T> {...props}>
			{label && <InputLabel htmlFor={id}>{label}</InputLabel>}
			<Select
				defaultValue={defaultValues?.[name]}
				id={id}
				inputProps={register(name, registerOptionsFromHook)}
				label={label}
			>
				{values?.map((value) => {
					return (
						<MenuItem key={value} value={value}>{itemLabel?.(value) ?? value}</MenuItem>
					)
				})}
			</Select>
		</FormItem>
	)
}

export default SelectForm
