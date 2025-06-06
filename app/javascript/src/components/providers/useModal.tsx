import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material'
import { TFunction } from 'i18next'
import { useState, useCallback, useMemo, ReactNode, MouseEvent, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import ButtonWithProcessing, { Props as ButtonWithProcessingProps } from 'src/components/atoms/ButtonWithProcessing'
import { ProcessingContext, ApiReturn } from 'src/components/providers/ProcessingProvider'
import { ResponseData } from 'src/core/axiosHttpClient'

type I18nParams = {
	action?: string
	itemKey?: string
	scope?: string
}

const I18N_MODAL_ITEMS = ['text', 'title'] as const

function translateItem(
	t: TFunction,
	key: (typeof I18N_MODAL_ITEMS)[number] | 'enter',
	i18n: I18nParams,
) {
	const { action, itemKey, scope } = i18n
	const text = action
		? t(`modal.confirm.${key}`, '', { action })
		: t(`${scope}.modal.${itemKey}.${key}`, '')

	return text === '' ? null : text
}

type ModalButtonProps<T = ResponseData> = Omit<ButtonWithProcessingProps<T>, 'processingKey'>
type CloseModalButtonProps = Omit<ModalButtonProps, 'handleInProcessing' | 'handleProcessingOptions'>

function injectToOnClick(
	buttonProps: ModalButtonProps, closeModal?: () => void,
): ModalButtonProps['onClick'] {
	const { onClick } = buttonProps

	return async (e: MouseEvent<HTMLButtonElement>, data?: ApiReturn<ResponseData>) => {
		try {
			await onClick?.(e, data)
			closeModal?.()

			return await Promise.resolve()
		} catch (error) {
			return Promise.reject(error)
		}
	}
}

function renderModalButton(
	buttonProps: ModalButtonProps | undefined,
	processingKey: string | undefined,
	options?: { withProcessing?: boolean },
) {
	if (!buttonProps) {
		return null
	}

	const { children, handleInProcessing, handleProcessingOptions, ...rest } = buttonProps
	const { withProcessing } = options ?? {}

	if (processingKey && withProcessing) {
		return (
			<ButtonWithProcessing
				handleInProcessing={handleInProcessing}
				handleProcessingOptions={handleProcessingOptions}
				processingKey={processingKey}
				{...rest}
			>
				{children}
			</ButtonWithProcessing>
		)
	}

	return <Button {...rest}>{children}</Button>
}

type ModalConfig = {
	allowCloseInProcessing?: boolean
	closeButtonProps?: CloseModalButtonProps
	content?: ReactNode
	enterButtonProps?: ModalButtonProps
	processingKey?: string
	text?: ReactNode
	title?: ReactNode
}

type ShowModalParams = ModalConfig & {
	closeButtonProps?: CloseModalButtonProps | 'default'
	i18n?: I18nParams
	noCloseAfterEnter?: boolean
}

function useModal() {
	const { t } = useTranslation()
	const { isProcessing } = useContext(ProcessingContext)
	const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null)

	const closeModal = useCallback(() => {
		setModalConfig(null)
	}, [])

	const showModal = useCallback(({
		i18n, noCloseAfterEnter = false, ...paramsRest
	}: ShowModalParams) => {
		const { closeButtonProps, enterButtonProps } = paramsRest

		if (i18n) {
			I18N_MODAL_ITEMS.forEach((key) => {
				!paramsRest[key] && (paramsRest[key] = translateItem(t, key, i18n))
			})
		}

		if (enterButtonProps) {
			if (i18n && !enterButtonProps.children) {
				enterButtonProps.children = translateItem(t, 'enter', i18n)
			}

			enterButtonProps.onClick = injectToOnClick(
				enterButtonProps, noCloseAfterEnter ? undefined : closeModal,
			)
		}

		if (closeButtonProps) {
			if (closeButtonProps === 'default') {
				paramsRest.closeButtonProps = { children: t('generic.cancel'), onClick: closeModal }
			} else {
				closeButtonProps.onClick = injectToOnClick(closeButtonProps, closeModal)
			}
		}

		setModalConfig(paramsRest)
	}, [closeModal, t])

	const modalComponent = useMemo(() => {
		if (!modalConfig) {
			return null
		}

		const {
			allowCloseInProcessing = false, closeButtonProps, content, enterButtonProps,
			processingKey, text, title,
		} = modalConfig

		return (
			<Dialog
				fullWidth
				onClose={
					!allowCloseInProcessing && isProcessing(processingKey)
						? undefined
						: closeModal
				}
				open
			>
				{title && (
					<DialogTitle sx={SxModalText}>
						{title}
					</DialogTitle>
				)}
				{content || (
					text && (
						<DialogContent>
							<DialogContentText sx={SxModalText}>
								{text}
							</DialogContentText>
						</DialogContent>
					)
				)}
				{(enterButtonProps ?? closeButtonProps) && (
					<DialogActions>
						{renderModalButton(closeButtonProps, processingKey, {
							withProcessing: !allowCloseInProcessing,
						})}
						{renderModalButton(enterButtonProps, processingKey, { withProcessing: true })}
					</DialogActions>
				)}
			</Dialog>
		)
	}, [closeModal, isProcessing, modalConfig])

	return { closeModal, modalComponent, showModal }
}

const SxModalText = {
	textAlign: 'center',
	whiteSpace: 'pre-wrap',
}

export default useModal
