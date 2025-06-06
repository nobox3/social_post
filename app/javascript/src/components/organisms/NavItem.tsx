import { Tab, Stack, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { MouseEventHandler, JSX } from 'react'
import { useTranslation } from 'react-i18next'

export type ListItem = {
	i18nKey: string
	icon: JSX.Element
}

type Props<T extends string> = {
	count?: number
	divider?: boolean
	menuItems: Record<T, ListItem>
	onClick?: MouseEventHandler<HTMLDivElement>
	value: T
}

function NavItem<T extends string>({
	count, divider = false, menuItems, onClick, value,
}: Props<T>) {
	const { t } = useTranslation()
	const { i18nKey, icon } = menuItems[value]

	return (
		<STab
			className={divider ? 'divider' : ''}
			icon={icon}
			iconPosition="start"
			label={(
				<Stack flexDirection="row" justifyContent="space-between" width="100%">
					{t(i18nKey)}
					{count !== undefined && <Box>{count}</Box>}
				</Stack>
			)}
			onClick={onClick}
			value={value}
		/>
	)
}

const STab = styled(Tab)`
	justify-content: flex-start;
	width: 100%;
	min-height: 50px;
	transition: background-color ${({ theme }) => theme.transitions.duration.shortest}ms;
	
	&:hover {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}

	&.divider {
		border-top: solid 1px ${({ theme }) => theme.palette.divider};
	}
`

export default NavItem
