import { MenuItem, Select as MuiSelect, InputLabel, SelectProps, FormControl } from '@mui/material'
import { useId, ReactNode } from 'react'

export type Props<V extends string | number> = Omit<SelectProps<V>, 'id'> & {
	itemLabel?: ((value: V) => ReactNode)
	values?: V[]
}

function Select<V extends string | number>({ itemLabel, label, values, ...props }: Props<V>) {
	const id = useId()

	return (
		<FormControl>
			{label && <InputLabel id={id}>{label}</InputLabel>}
			<MuiSelect label={label} labelId={id} {...props}>
				{values?.map((value) => {
					return (
						<MenuItem key={value} value={value}>{itemLabel?.(value) ?? value}</MenuItem>
					)
				})}
			</MuiSelect>
		</FormControl>
	)
}

export default Select
