import { ReactNode } from 'react'

export type FlashMessageType = 'notice' | 'alert' | 'success' | 'error'

type FlashMessage = {
	text: ReactNode | ReactNode[]
	type?: FlashMessageType
}

export default FlashMessage
