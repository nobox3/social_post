import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

function useTranslationWithModel() {
	const { i18n, t } = useTranslation()

	const tModel = useCallback(
		(modelName?: string, attribute?: string, enumKey?: string) => {
			if (!modelName) {
				return ''
			}

			if (!attribute) {
				return t(`model.${modelName}`)
			}

			if (!enumKey) {
				return t(`model.attributes.${modelName}.${attribute}`)
			}

			return t(`model.attributes.${modelName}/${attribute}.${enumKey}`)
		},
		[t],
	)

	return { i18n, t, tModel }
}

export default useTranslationWithModel
