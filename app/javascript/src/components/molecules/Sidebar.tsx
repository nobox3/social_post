import { Drawer, Toolbar } from '@mui/material'
import { ReactNode } from 'react'

type Props = {
	children?: ReactNode
	width?: number
}

function Sidebar({ children, width = 200 }: Props) {
	return (
		<Drawer
			anchor="left"
			sx={{
				'& .MuiDrawer-paper': { boxSizing: 'border-box', width },
				flexShrink: 0,
				width,
			}}
			variant="permanent"
		>
			<Toolbar />
			{children}
		</Drawer>
	)
}

export default Sidebar
