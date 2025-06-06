import User from 'src/core/types/User'

type CurrentUser = User & {
	language?: string
	theme_mode?: string
}

export default CurrentUser
