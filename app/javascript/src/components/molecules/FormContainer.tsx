import { Stack, Typography, Box, SxProps, Theme } from '@mui/material'
import { useContext, ReactNode, useMemo } from 'react'
import { UseFormReturn, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import ButtonWithProcessing, { Props as ButtonWithProcessingProps } from 'src/components/atoms/ButtonWithProcessing'
import { ProcessingContext, ApiReturn, HandleProcessingOptions } from 'src/components/providers/ProcessingProvider'
import { ResponseData } from 'src/core/axiosHttpClient'

export type Props<T extends FieldValues, R = ResponseData> = {
	buttonProps?: Omit<ButtonWithProcessingProps, 'processingKey' | 'type'> | null
	children?: ReactNode
	handleApi?: (values: T) => Promise<ApiReturn<R>>
	handleProcessingOptions?: HandleProcessingOptions
	onSubmitSucceeded?: (result: ApiReturn<R>, values: T) => void
	processingKey: string
	sx?: SxProps<Theme>
	title?: string
	useFormReturn: UseFormReturn<T>
}

function FormContainer<T extends FieldValues, R = ResponseData>({
	buttonProps,
	children,
	handleApi,
	handleProcessingOptions,
	onSubmitSucceeded,
	processingKey,
	sx,
	title,
	useFormReturn,
}: Props<T, R>) {
	const { t } = useTranslation()
	const { handleProcessing } = useContext(ProcessingContext)
	const { handleSubmit } = useFormReturn

	const buttonComponent = useMemo(() => {
		if (buttonProps === null) {
			return null
		}

		const { children: buttonChildren, size = 'small', variant = 'contained', ...restButtonProps } = buttonProps ?? {}

		return (
			<Box>
				<ButtonWithProcessing processingKey={processingKey} size={size} type="submit" variant={variant} {...restButtonProps}>
					<Typography>{buttonChildren ?? t('generic.send')}</Typography>
				</ButtonWithProcessing>
			</Box>
		)
	}, [buttonProps, processingKey, t])

	return (
		<Stack
			autoComplete="off"
			component="form"
			noValidate
			onSubmit={
				handleApi
					? handleSubmit(async (values: T) => {
						const result = await handleProcessing(processingKey, () => handleApi(values), {
							redirectOnSuccess: true, ...handleProcessingOptions,
						})

						onSubmitSucceeded?.(result, values)
					})
					: undefined
			}
			spacing={2}
			sx={{ width: '100%', ...sx }}
		>
			{title !== '' && <Typography variant="h4">{title ?? t(processingKey)}</Typography>}
			{children}
			{buttonComponent}
		</Stack>
	)
}

export default FormContainer
