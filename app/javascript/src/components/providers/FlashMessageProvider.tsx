import { Box } from '@mui/material'
import { useEffect, ReactNode, createContext } from 'react'

import useFlashMessage from 'src/components/hooks/useFlashMessage'
import FlashMessage from 'src/core/types/FlashMessage'

export const FlashMessageContext = createContext<
	(messages: FlashMessage | FlashMessage[]) => void
>(() => {})

type Props = {
	children: ReactNode
	flashMessagesOnPageLoaded?: FlashMessage[]
}

function FlashMessageProvider({ children, flashMessagesOnPageLoaded }: Props) {
	const { addFlashMessages, renderFlashMessages } = useFlashMessage('from-bottom')

	useEffect(() => {
		flashMessagesOnPageLoaded?.forEach((m) => addFlashMessages(m))
	}, [addFlashMessages, flashMessagesOnPageLoaded])

	return (
		<>
			<Box sx={SxFlashMessages}>{renderFlashMessages()}</Box>
			<FlashMessageContext.Provider value={addFlashMessages}>
				{children}
			</FlashMessageContext.Provider>
		</>
	)
}

const SxFlashMessages = {
	bottom: 0,
	left: 0,
	margin: 'auto',
	position: 'fixed',
	right: 0,
	width: 'fit-content',
	zIndex: 9000,
}

export default FlashMessageProvider
