import { ReactNode, useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ApiResponseErrorContext } from 'src/components/providers/ApiResponseErrorProvider'
import { FlashMessageContext } from 'src/components/providers/FlashMessageProvider'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { ResponseError, extractErrorMessages } from 'src/core/axiosHttpClient'
import FlashMessage from 'src/core/types/FlashMessage'

function toFlashMessagesFromError(error: ResponseError): FlashMessage[] {
	const errors = error.response?.data?.errors

	if (errors && errors.length > 0) {
		return errors.map((text) => ({ text, type: 'error' }))
	}

	return [{ text: error.message, type: 'error' }]
}

type IProps = {
	children?: ReactNode
}

const HandleApiResponseError = ({ children }: IProps) => {
	const { t } = useTranslation()
	const { responseError, setResponseError } = useContext(ApiResponseErrorContext)
	const addFlashMessages = useContext(FlashMessageContext)
	const { closeModal, showModal } = useContext(ModalContext)

	const showErrorModal = useCallback(
		(error: ResponseError) => {
			const { status = 500, statusText = 'Internal Server Error' } = error.response ?? {}
			const message = extractErrorMessages(error, { default: () => t('system_errors.default') }).join(', ')

			showModal({
				enterButtonProps: {
					children: t('generic.reload'),
					onClick: () => window.location.reload(),
				},
				text: `${message}\n${t('system_errors.reload_this_page')}`,
				title: `${status} ${statusText}`,
			})
		},
		[showModal, t],
	)

	useEffect(() => {
		if (!responseError) {
			return
		}

		switch (responseError.response?.status) {
			case undefined:
				break

			case 401: // Unauthorized
			case 403: // Forbidden
			case 422: // Unprocessable Entity
				closeModal()
				addFlashMessages(toFlashMessagesFromError(responseError))
				break

			default:
				showErrorModal(responseError)
				break
		}

		setResponseError(null)
	}, [addFlashMessages, closeModal, responseError, setResponseError, showErrorModal])

	return children
}

export default HandleApiResponseError
