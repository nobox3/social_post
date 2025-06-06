import EmojiMartData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined'
import { IconButton, ButtonProps, Popover } from '@mui/material'
import { useState, useMemo, SyntheticEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import ButtonWithProcessing from 'src/components/atoms/ButtonWithProcessing'
import { isTouchDevice, insertStr } from 'src/utils'

type UseEmojiPickerReturn = {
	emojiButton: ReactNode
	emojiPicker: ReactNode
}

type UseEmojiPickerParams = {
	currentTextareaValue: string
	onEmojiSelected?: (newTextareaValue: string) => void
	processingKey?: string
	textCursorPosition?: number
}

function useEmojiPicker({
	currentTextareaValue,
	onEmojiSelected,
	processingKey,
	textCursorPosition = 0,
}: UseEmojiPickerParams): UseEmojiPickerReturn {
	const { i18n: { language } } = useTranslation()
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<HTMLButtonElement | null>(null)

	const emojiButton = useMemo(() => {
		if (isTouchDevice()) {
			return null
		}

		const buttonProps: ButtonProps = {
			onClick: (e: SyntheticEvent<HTMLButtonElement>) => {
				const { currentTarget } = e
				setIsEmojiPickerOpen((current) => (current ? null : currentTarget))
			},
		}

		if (processingKey) {
			return (
				<ButtonWithProcessing processingKey={processingKey} {...buttonProps}>
					<EmojiEmotionsOutlinedIcon />
				</ButtonWithProcessing>
			)
		}

		return (
			<IconButton {...buttonProps}>
				<EmojiEmotionsOutlinedIcon />
			</IconButton>
		)
	}, [processingKey])

	const emojiPicker = useMemo(() => {
		if (!isEmojiPickerOpen) {
			return null
		}

		return (
			<Popover
				anchorEl={isEmojiPickerOpen}
				anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
				onClose={() => setIsEmojiPickerOpen(null)}
				open={!!isEmojiPickerOpen}
				transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
			>
				<Picker
					data={EmojiMartData}
					locale={language}
					maxFrequentRows={2}
					onEmojiSelect={(emoji: { native: string }) => {
						onEmojiSelected?.(insertStr(currentTextareaValue, emoji.native, textCursorPosition))
						setIsEmojiPickerOpen(null)
					}}
					previewPosition="none"
				/>
			</Popover>
		)
		// return (
		// 	<MouseDownOutside
		// 		handleMouseDownOutside={() => setIsEmojiPickerOpen(null)}
		// 		ignoredNodes={isEmojiPickerOpen}
		// 	>
		// 		<Picker
		// 			data={EmojiMartData}
		// 			locale={language}
		// 			maxFrequentRows={2}
		// 			onEmojiSelect={(emoji: { native: string }) => {
		// 				onEmojiSelected?.(insertStr(currentTextareaValue, emoji.native, textCursorPosition))
		// 				setIsEmojiPickerOpen(null)
		// 			}}
		// 			previewPosition="none"
		// 		/>
		// 	</MouseDownOutside>
		// )
	}, [isEmojiPickerOpen, language, currentTextareaValue, textCursorPosition, onEmojiSelected])

	return { emojiButton, emojiPicker }
}

export default useEmojiPicker
