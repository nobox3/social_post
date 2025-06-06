import { Button, ButtonProps } from '@mui/material'
import { useContext, ReactNode, MouseEvent } from 'react'

import LoadingSpinner from 'src/components/atoms/LoadingSpinner'
import { ProcessingContext, ApiReturn, HandleProcessingOptions } from 'src/components/providers/ProcessingProvider'
import { ResponseData } from 'src/core/axiosHttpClient'

export type Props<T = ResponseData> = Omit<ButtonProps, 'onClick'> & {
	children?: ReactNode
	handleInProcessing?: () => Promise<ApiReturn<T>>
	handleProcessingOptions?: HandleProcessingOptions
	onClick?: (
		e: MouseEvent<HTMLButtonElement>,
		data?: ApiReturn<T>,
	) => void | Promise<void>
	processingKey: string
}

function ButtonWithProcessing<T = ResponseData>({
	children, handleInProcessing, handleProcessingOptions, onClick, processingKey, sx, ...props
}: Props<T>) {
	const { handleProcessing, isProcessing } = useContext(ProcessingContext)
	const processing = isProcessing(processingKey)

	return (
		<Button
			onClick={
				onClick || handleInProcessing
					? async (e: MouseEvent<HTMLButtonElement>) => {
						let data: ApiReturn<T> | undefined

						if (handleInProcessing) {
							data = await handleProcessing(
								processingKey,
								handleInProcessing,
								handleProcessingOptions,
							)
						}

						await onClick?.(e, data)
					}
					: undefined
			}
			sx={processing ? { ...sx, columnGap: '6px', cursor: 'auto', pointerEvents: 'none' } : sx}
			{...props}
		>
			{processing && <LoadingSpinner delay={0.3} width="1.5em" /> }
			{children}
		</Button>
	)
}

export default ButtonWithProcessing
