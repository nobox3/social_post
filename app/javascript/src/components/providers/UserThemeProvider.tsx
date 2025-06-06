import { ThemeProvider, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState, useCallback, ReactNode, useMemo, createContext } from 'react'

import muiThemes, { ThemeMode } from 'src/core/muiThemes'
import { updateThemeMode } from 'src/services/appSettingsService'
import { parseJsonMetaContent } from 'src/utils/metaUtils'

export type UserThemeMode = ThemeMode | 'device'

type UserThemeModeProviderValue = {
	onThemeModeChange: (changed: UserThemeMode) => Promise<void>
	userThemeMode: UserThemeMode
}

type ThemeModeInfo = {
	available_modes: UserThemeMode[]
	user_theme_mode: UserThemeMode
}

const {
	available_modes = ['device'], user_theme_mode = 'device',
} = parseJsonMetaContent<ThemeModeInfo>('theme-mode')

export const availableThemeModes = available_modes

export const UserThemeModeContext = createContext<UserThemeModeProviderValue>({
	onThemeModeChange: async () => {}, userThemeMode: user_theme_mode,
})

type Props = {
	children: ReactNode
}

function UserThemeProvider({ children }: Props) {
	const [userThemeMode, setUserThemeMode] = useState<UserThemeMode>(user_theme_mode)

	const onThemeModeChange = useCallback(async (changed: UserThemeMode) => {
		await updateThemeMode({ theme_mode: changed })
		setUserThemeMode(changed)
	}, [])

	const providerValue = useMemo(() => {
		return { onThemeModeChange, userThemeMode }
	}, [onThemeModeChange, userThemeMode])

	const matches = useMediaQuery('(prefers-color-scheme: dark)')

	const muiTheme = useMemo<Theme>(() => {
		if (userThemeMode === 'device') {
			return muiThemes[matches ? 'dark' : 'light']
		}

		return muiThemes[userThemeMode]
	}, [matches, userThemeMode])

	return (
		<UserThemeModeContext.Provider value={providerValue}>
			<ThemeProvider theme={muiTheme}>
				{children}
			</ThemeProvider>
		</UserThemeModeContext.Provider>
	)
}

export default UserThemeProvider
