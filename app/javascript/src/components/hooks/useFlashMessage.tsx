import { useCallback, useState } from 'react'

import FlashMessageContent, { DisplayedFlashMessage, ShowFrom } from 'src/components/hooks/FlashMessageContent'
import FlashMessage from 'src/core/types/FlashMessage'

const DEFAULT_REMAIN_TIME = 6000

function useFlashMessage(showFrom: ShowFrom) {
	const [messagesState, setMessagesState] = useState<DisplayedFlashMessage[]>([])

	const deleteMessage = useCallback((id: NodeJS.Timeout) => {
		setMessagesState((current) => current.filter((m) => m.id !== id))
		clearTimeout(id)
	}, [])

	const handleTimerTimeout = useCallback((id: NodeJS.Timeout) => {
		setMessagesState((current) => {
			return current.map((m) => (m.id === id ? { ...m, isTimerTimeout: true } : m))
		})
	}, [])

	const addMessages = useCallback(
		(flashMessages: FlashMessage[], remainTime: number = DEFAULT_REMAIN_TIME) => {
			const messages = flashMessages.map((m) => {
				const id = setTimeout(() => handleTimerTimeout(id), remainTime)

				return { id, isTimerTimeout: false, ...m }
			})

			setMessagesState((current) => [...current, ...messages])
		},
		[handleTimerTimeout],
	)

	const addFlashMessages = useCallback(
		(flashMessages: FlashMessage | FlashMessage[]) => {
			addMessages(Array.isArray(flashMessages) ? flashMessages : [flashMessages])
		},
		[addMessages],
	)

	const renderFlashMessages = useCallback(() => {
		return messagesState.map((message) => {
			return (
				<FlashMessageContent
					key={message.id.toString()}
					deleteMessage={deleteMessage}
					message={message}
					showFrom={showFrom}
				/>
			)
		})
	}, [deleteMessage, messagesState, showFrom])

	return { addFlashMessages, renderFlashMessages }
}

export default useFlashMessage
