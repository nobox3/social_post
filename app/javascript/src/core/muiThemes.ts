import { createTheme, Theme } from '@mui/material/styles'

import { muiLightThemeOptions, muiDarkThemeOptions } from 'src/static/muiCustomThemeOptions'

export type ThemeMode = 'dark' | 'light'
export type Themes = Record<string, Theme>

const muiThemes: Themes = {
	dark: createTheme(muiDarkThemeOptions),
	light: createTheme(muiLightThemeOptions),
}

export default muiThemes
