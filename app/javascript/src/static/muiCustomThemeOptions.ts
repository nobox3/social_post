import { ThemeOptions, PaletteOptions } from '@mui/material'

const typography = {
	fontFamily: [
		'"Hiragino Kaku Gothic ProN"',
		'"Hiragino Kaku Gothic Pro"',
		'Meiryo',
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
	].join(','),
}

const lightPalette: PaletteOptions = {
	background: {
		default: '#f7f7f8',
		paper: '#fff',
	},
	divider: '#e6e6eb',
	mode: 'light',
	primary: {
		contrastText: '#fff',
		main: '#10a37f',
	},
	secondary: {
		contrastText: '#fff',
		main: '#5436da',
	},
	text: {
		primary: '#222427',
		secondary: '#6e6e80',
	},
}

const darkPalette: PaletteOptions = {
	background: {
		default: '#15171a',
		paper: '#202123',
	},
	divider: '#343541',
	mode: 'dark',
	primary: {
		contrastText: '#fff',
		main: '#10a37f',
	},
	secondary: {
		contrastText: '#fff',
		main: '#5436da',
	},
	text: {
		primary: '#ececf1',
		secondary: '#a3a3b3',
	},
}

export const muiLightThemeOptions: ThemeOptions = {
	palette: lightPalette, typography,
}

export const muiDarkThemeOptions: ThemeOptions = {
	palette: darkPalette, typography,
}
