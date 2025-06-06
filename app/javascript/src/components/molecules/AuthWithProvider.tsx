import GoogleIcon from '@mui/icons-material/Google'
import { Stack, Button } from '@mui/material'
import { useMemo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { getCsrfToken } from 'src/utils/metaUtils'
import { toStrSearchParams } from 'src/utils/searchParams'

const formInputs = <input name="authenticity_token" type="hidden" value={getCsrfToken()} />

const AUTH_PROVIDERS = ['google_oauth2'] as const
type AuthProvider = typeof AUTH_PROVIDERS[number]

type ProviderItem = {
	icon: ReactNode
	name: string
}

const PROVIDER_ITEMS: Record<AuthProvider, ProviderItem> = {
	google_oauth2: { icon: <GoogleIcon />, name: 'Google' },
}

type Props = {
	isRegistration?: boolean
}

function AuthWithProvider({ isRegistration = false }: Props) {
	const { t } = useTranslation()

	const params = useMemo(() => {
		return toStrSearchParams({ is_registration: isRegistration })
	}, [isRegistration])

	const i18nKey = `user.auth.with_provider.${isRegistration ? 'sign_up' : 'sign_in'}`

	return (
		<Stack spacing={2}>
			{AUTH_PROVIDERS.map((provider) => {
				const { icon, name } = PROVIDER_ITEMS[provider]

				return (
					<form key={provider} action={`/users/auth/${provider}${params}`} method="post">
						<Button fullWidth size="large" startIcon={icon} type="submit" variant="outlined">
							{t(i18nKey, { name })}
						</Button>
						{formInputs}
					</form>
				)
			})}
		</Stack>
	)
}

export default AuthWithProvider
