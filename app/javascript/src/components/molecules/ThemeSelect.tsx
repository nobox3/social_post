import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined'
import { Typography, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useContext } from 'react'

import useTranslationWithModel from 'src/components/hooks/useTranslationWithModel'
import { availableThemeModes, UserThemeModeContext, UserThemeMode } from 'src/components/providers/UserThemeProvider'

const THEME_MODE_ICONS = {
	dark: { active: <DarkModeOutlinedIcon color="inherit" />, inactive: <DarkModeOutlinedIcon color="action" /> },
	device: {
		active: <SettingsBrightnessOutlinedIcon color="inherit" />, inactive: <SettingsBrightnessOutlinedIcon color="action" />,
	},
	light: { active: <LightModeOutlinedIcon color="inherit" />, inactive: <LightModeOutlinedIcon color="action" /> },
} as const

type Props = {
	noItemLabel?: boolean
}

function ThemeSelect({ noItemLabel = false }: Props) {
	const { tModel } = useTranslationWithModel()
	const { onThemeModeChange, userThemeMode } = useContext(UserThemeModeContext)

	return (
		<ToggleButtonGroup
			exclusive
			onChange={(e, value: UserThemeMode) => value && onThemeModeChange(value)}
			size="small"
			value={userThemeMode}
		>
			{availableThemeModes.map((value) => {
				const icon = THEME_MODE_ICONS[value]
				const isSelected = userThemeMode === value

				return (
					<ToggleButton
						key={value}
						color={isSelected ? 'primary' : 'standard'}
						sx={(theme) => ({
							borderColor: theme.palette.primary.main,
							opacity: isSelected ? 1 : 0.5,
						})}
						value={value}
					>
						<Stack alignItems="center" direction="row" spacing={1}>
							{isSelected ? icon.active : icon.inactive}
							{!noItemLabel && (
								<Typography>{tModel('user', 'theme_mode', value)}</Typography>
							)}
						</Stack>
					</ToggleButton>
				)
			})}
		</ToggleButtonGroup>
	)
}

export default ThemeSelect
