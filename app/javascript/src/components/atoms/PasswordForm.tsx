import VisibilityOutlined from '@mui/icons-material/Visibility'
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOff'
import { InputAdornment, IconButton } from '@mui/material'
import { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import InputTextForm, { Props as InputTextFormProps } from 'src/components/atoms/InputTextForm'
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, VALID_PASSWORD_REGEX } from 'src/static/constants'

type Props<T extends FieldValues> =
	Omit<InputTextFormProps<T>, 'endAdornment' | 'type' | 'required' | 'minLength' | 'maxLength' | 'placeholder'> & {
		isNew?: boolean
	}

function PasswordForm<T extends FieldValues>({ isNew = false, ...props }: Props<T>) {
	const { t } = useTranslation()
	const [showPassword, setShowPassword] = useState<boolean>(false)

	return (
		<InputTextForm<T>
			endAdornment={(
				<InputAdornment position="end">
					<IconButton
						aria-label="toggle password visibility"
						edge="end"
						onClick={() => setShowPassword((show) => !show)}
						onMouseDown={(e) => e.preventDefault()}
					>
						{showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
					</IconButton>
				</InputAdornment>
			)}
			maxLength={MAX_PASSWORD_LENGTH}
			minLength={MIN_PASSWORD_LENGTH}
			placeholder={isNew ? t('user.auth.placeholder.password', { count: MIN_PASSWORD_LENGTH }) : ''}
			registerOptions={{ pattern: { message: t('common_errors.invalid_password_format'), value: VALID_PASSWORD_REGEX } }}
			required
			type={showPassword ? 'text' : 'password'}
			{...props}
		/>
	)
}

export default PasswordForm
