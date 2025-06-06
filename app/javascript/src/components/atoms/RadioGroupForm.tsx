import { FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material'
import { useId, ReactNode } from 'react'
import { FieldValues, RegisterOptions } from 'react-hook-form'

import FormItem, { Props as FormItemProps } from 'src/components/atoms/FormItem'
import useReactHookFormValidations from 'src/components/hooks/useReactHookFormValidations'

type Props<T extends FieldValues, V extends string | number> = FormItemProps<T> & {
	icon?: (value: V) => { active: ReactNode, inactive: ReactNode }
	itemLabel?: ((value: V) => ReactNode)
	label?: ReactNode
	registerOptions?: RegisterOptions<T>
	row?: boolean
	values?: V[]
}

function RadioGroupForm<T extends FieldValues, V extends string | number>({
	icon, itemLabel, label, registerOptions, row, values, ...props
}: Props<T, V>) {
	const id = useId()
	const { name, required, size, useFormReturn } = props
	const { formState: { defaultValues }, register } = useFormReturn

	const registerOptionsFromHook = useReactHookFormValidations<T>({
		required, targetOptions: registerOptions,
	})

	const { onChange, ...registerReturnRest } = register(name, registerOptionsFromHook)

	return (
		<FormItem<T>{...props}>
			{label && <FormLabel focused={false} id={id}>{label}</FormLabel>}
			<RadioGroup
				defaultValue={defaultValues?.[name]}
				onChange={onChange}
				row={row}
			>
				{values?.map((value) => {
					const { active, inactive } = icon?.(value) ?? {}

					return (
						<FormControlLabel
							key={value}
							control={(
								<Radio
									checkedIcon={active}
									icon={inactive}
									size={size}
									slotProps={{ input: registerReturnRest }}
								/>
							)}
							label={itemLabel?.(value) ?? ''}
							required={required}
							value={value}
						/>
					)
				})}
			</RadioGroup>
		</FormItem>
	)
}

export default RadioGroupForm
