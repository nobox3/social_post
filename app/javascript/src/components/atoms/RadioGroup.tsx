import {
	FormControlLabel, Radio, RadioGroup as MuiRadioGroup, RadioGroupProps,
	FormLabel, FormControl,
} from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import { useId, ReactNode } from 'react'

type Props<V extends string | number> = RadioGroupProps & {
	icon?: (value: V) => { active: ReactNode, inactive: ReactNode }
	itemLabel?: ((value: V) => ReactNode)
	label?: ReactNode
	required?: boolean
	size?: OverridableStringUnion<'small' | 'medium'>
	values?: V[]
}

function RadioGroup<V extends string | number>({
	icon, itemLabel, label, required, size, values, ...props
}: Props<V>) {
	const id = useId()

	return (
		<FormControl>
			{label && <FormLabel focused={false} id={id}>{label}</FormLabel>}
			<MuiRadioGroup {...props}>
				{values?.map((value) => {
					const { active, inactive } = icon?.(value) ?? {}

					return (
						<FormControlLabel
							key={value}
							control={(
								<Radio checkedIcon={active} icon={inactive} size={size} />
							)}
							label={itemLabel?.(value) ?? ''}
							required={required}
							value={value}
						/>
					)
				})}
			</MuiRadioGroup>
		</FormControl>
	)
}

export default RadioGroup
