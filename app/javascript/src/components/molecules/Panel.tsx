import { Typography, Container, Box, Breakpoint } from '@mui/material'
import { ReactNode } from 'react'

type Props = {
	alignItems?: string
	children?: ReactNode
	maxWidth?: Breakpoint | false
	textAlign?: string
	title?: ReactNode
}

function Panel({
	alignItems = 'flex-start', children, maxWidth = 'md', textAlign = 'auto', title,
}: Props) {
	return (
		<Container maxWidth={maxWidth}>
			<Box sx={{ alignItems, padding: '16px', textAlign }}>
				{title && <Typography sx={{ marginBottom: '24px' }} variant="h4">{title}</Typography>}
				{children}
			</Box>
		</Container>
	)
}

export default Panel
