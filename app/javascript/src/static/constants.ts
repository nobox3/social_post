// app/constants/default_values.rb
import backendConstants from 'src/static/backend_constants.json'

export const {
	ACCEPTED_IMAGE_TYPES,
	LOCALE_LONG,
	MAX_IMAGE_DIMENSION_SIZE,
	MAX_IMAGE_FILE_SIZE,
	MAX_IMAGES_COUNT,
	MAX_TEXT_COUNT,
	MAX_TEXTAREA_COUNT,
	SITE_NAME,
} = backendConstants

export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 64
export const VALID_PASSWORD_REGEX = /^[a-zA-Z0-9]+$/
export const MAX_IMAGE_FILE_SIZE_MB = `${MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB` // 30MB
export const STR_ACCEPTED_IMAGE_TYPES = ACCEPTED_IMAGE_TYPES.map((type) => type.replace('image/', '')).join(', ')

export const NO_AVATAR_COLORS = [
	'#ff8484',
	'#ff945f',
	'#ffcc69',
	'#e2e06a',
	'#85da72',
	'#5ed6e4',
	'#73c5f7',
	'#8ca4ff',
	'#ca8ff5',
	'#ff85cd',
]
