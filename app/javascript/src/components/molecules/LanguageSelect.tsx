import { SelectChangeEvent } from '@mui/material'
import { useCallback, useContext } from 'react'

import Select from 'src/components/atoms/Select'
import useTranslationWithModel from 'src/components/hooks/useTranslationWithModel'
import { SiteMetaContext } from 'src/components/providers/SiteMetaProvider'
import { availableLocales, AvailableLocale } from 'src/core/i18n/commonConfig'
import { updateLocale } from 'src/services/appSettingsService'

function LanguageSelect() {
	const { i18n, tModel } = useTranslationWithModel()
	const { updateMetaOnLanguageChange } = useContext(SiteMetaContext)

	const onLanguageChange = useCallback(
		async (e: SelectChangeEvent<AvailableLocale>) => {
			const value = e.target.value as AvailableLocale

			await updateLocale({ language: value })
			await i18n.changeLanguage(value)
			updateMetaOnLanguageChange(value)
		},
		[i18n, updateMetaOnLanguageChange],
	)

	return (
		<Select
			itemLabel={(value) => tModel('user', 'language', value)}
			label={tModel('user', 'language')}
			onChange={onLanguageChange}
			size="small"
			value={i18n.language as AvailableLocale}
			values={availableLocales}
		/>
	)
}

export default LanguageSelect
