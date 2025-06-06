import styled from '@emotion/styled'
import { Alert, AlertColor } from '@mui/material'
import { useEffect } from 'react'
import { useTransitionState } from 'react-transition-state'

import FlashMessage, { FlashMessageType } from 'src/core/types/FlashMessage'

const TYPE_TO_SEVERITY: Record<FlashMessageType, AlertColor> = {
	alert: 'warning',
	error: 'error',
	notice: 'info',
	success: 'success',
}

export type ShowFrom = 'from-bottom' | 'from-left'

export type DisplayedFlashMessage = {
	id: NodeJS.Timeout
	isTimerTimeout: boolean
} & FlashMessage

type Props = {
	deleteMessage: (id: NodeJS.Timeout) => void
	message: DisplayedFlashMessage
	showFrom: ShowFrom
}

function FlashMessageContent({ deleteMessage, message, showFrom }: Props) {
	const { id, isTimerTimeout, text, type = 'notice' } = message
	const [{ status }, toggle] = useTransitionState(
		{ mountOnEnter: true, preEnter: true, timeout: 200 },
	)

	useEffect(() => {
		toggle(!isTimerTimeout)
	}, [isTimerTimeout, toggle])

	useEffect(() => {
		status === 'exited' && deleteMessage(id)
	}, [deleteMessage, id, status])

	return (
		<SFlashMessage className={`${status} ${showFrom}`}>
			<Alert
				onClose={() => toggle(false)}
				severity={TYPE_TO_SEVERITY[type]}
				sx={{ marginBottom: '8px', width: '100%' }}
				variant="filled"
			>
				{text}
			</Alert>
		</SFlashMessage>
	)
}

const SFlashMessage = styled.div`
  &.preEnter {
    display: none;
  }

  &.entering {
    opacity: 0;

    &.from-bottom {
      transform: translateY(100%);
    }

    &.from-left {
      transform: translateX(-100%);
    }
  }

  &.entered {
    opacity: 1;
    transition: all 0.2s ease-out;

    &.from-bottom {
      transform: translateY(0);
    }

    &.from-left {
      transform: translateX(0);
    }
  }

  &.exiting {
    opacity: 0;
    transition: all 0.2s ease-in;

    &.from-bottom {
      transform: translateY(100%);
    }

    &.from-left {
      transform: translateX(-100%);
    }
  }

  &.unmounted {
    display: none;
  }
`

export default FlashMessageContent
